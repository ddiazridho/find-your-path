import { loadEnvConfig } from "@next/env";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Program } from "../lib/university/schema";

loadEnvConfig(process.cwd());

// Matches Python uuid.uuid5(uuid.NAMESPACE_URL, `fyp:${id}`), preserving existing Qdrant points.
function pointId(id: string) {
  const namespace = Buffer.from("6ba7b8119dad11d180b400c04fd430c8", "hex");
  const bytes = createHash("sha1").update(namespace).update(`fyp:${id}`, "utf8").digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function seed() {
  const { COLLECTION, EMBEDDING_MODEL, VECTOR_SIZE, openaiClient, qdrantClient } = await import("../lib/university/clients");
  const programs = JSON.parse(await readFile(resolve("data/universities/programs.json"), "utf8")) as Program[];
  if (new Set(programs.map(row => row.id)).size !== programs.length) throw new Error("Duplicate program IDs");
  const qdrant = qdrantClient();
  const exists = await qdrant.collectionExists(COLLECTION);
  if (!exists.exists) {
    await qdrant.createCollection(COLLECTION, {
      vectors: {
        interest: { size: VECTOR_SIZE, distance: "Cosine" },
        career: { size: VECTOR_SIZE, distance: "Cosine" },
        learning: { size: VECTOR_SIZE, distance: "Cosine" },
      },
    });
  }
  const info = await qdrant.getCollection(COLLECTION);
  const vectors = info.config.params.vectors;
  const namedVectors = vectors as Record<string, { size?: number }> | undefined;
  if (!namedVectors || ["interest", "career", "learning"].some(name => namedVectors[name]?.size !== VECTOR_SIZE)) {
    throw new Error("Collection vector schema mismatch. Use a new QDRANT_COLLECTION.");
  }
  for (const field of ["bidang", "jenjang"] as const) {
    if (!info.payload_schema[field]) await qdrant.createPayloadIndex(COLLECTION, { field_name: field, field_schema: "keyword", wait: true });
  }
  for (const field of ["biaya_min_per_semester", "biaya_max_per_semester"] as const) {
    if (!info.payload_schema[field]) await qdrant.createPayloadIndex(COLLECTION, { field_name: field, field_schema: "integer", wait: true });
  }
  if (!process.argv.includes("--force") && info.points_count === programs.length) {
    console.log(`${COLLECTION}: ${programs.length} program sudah terindeks. Gunakan --force untuk memperbarui.`);
    return;
  }
  const texts = programs.flatMap(row => [row.minat, row.career_text, row.learning_text]);
  const response = await openaiClient().embeddings.create({ model: EMBEDDING_MODEL, input: texts, dimensions: VECTOR_SIZE });
  const vectorsByPosition = new Map(response.data.map(item => [item.index, item.embedding]));
  const points = programs.map((row, index) => ({
    id: pointId(row.id),
    vector: {
      interest: vectorsByPosition.get(3 * index)!,
      career: vectorsByPosition.get(3 * index + 1)!,
      learning: vectorsByPosition.get(3 * index + 2)!,
    },
    payload: row,
  }));
  await qdrant.upsert(COLLECTION, { wait: true, points });
  console.log(`${COLLECTION}: ${points.length} program terindeks menggunakan ${EMBEDDING_MODEL} (${VECTOR_SIZE} dimensi).`);
}

seed().catch(error => {
  console.error("Seeding failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
