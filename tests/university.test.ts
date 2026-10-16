import test from "node:test";
import assert from "node:assert/strict";
import { recommendationRequestSchema } from "../lib/university/schema";
import { buildFilter, scoreHit, uniqueUniversities } from "../lib/university/pipeline";
import type { Program } from "../lib/university/schema";

const valid = {
  minat: "Saya senang membuat aplikasi dan menganalisis data.",
  bidang: ["Teknologi"], jenjang: ["S1"], budget: { min: 0, max: 15_000_000 },
  prioritas: ["interest", "career", "budget", "learning"],
};

test("validasi menolak filter kosong, budget terbalik, dan prioritas duplikat", () => {
  for (const change of [
    { bidang: [] }, { jenjang: [] }, { budget: { min: 10_000_000, max: 5_000_000 } },
    { prioritas: ["interest", "interest", "budget", "learning"] },
  ]) assert.equal(recommendationRequestSchema.safeParse({ ...valid, ...change }).success, false);
});

test("filter Qdrant membatasi bidang, jenjang, dan kedua ujung rentang biaya", () => {
  const filter = buildFilter(recommendationRequestSchema.parse(valid));
  assert.deepEqual(filter.must, [
    { key: "bidang", match: { any: ["Teknologi"] } },
    { key: "jenjang", match: { any: ["S1"] } },
    { key: "biaya_min_per_semester", range: { gte: 0 } },
    { key: "biaya_max_per_semester", range: { lte: 15_000_000 } },
  ]);
});

test("urutan prioritas mengubah skor dan pilihan tidak mengulang universitas", () => {
  const payload = { id: "one", universitas: "Kampus A", biaya_max_per_semester: 14_000_000 } as Program;
  const vectors = { interest: [1, 0], career: [0, 1], learning: [0, 1] };
  const first = scoreHit(payload, vectors, [1, 0], recommendationRequestSchema.parse(valid));
  const budgetFirst = scoreHit(payload, vectors, [1, 0], recommendationRequestSchema.parse({ ...valid, prioritas: ["budget", "career", "interest", "learning"] }));
  assert.ok(first.score > budgetFirst.score);
  const second = scoreHit({ ...payload, id: "two" }, vectors, [1, 0], recommendationRequestSchema.parse(valid));
  assert.equal(uniqueUniversities([first, second]).length, 1);
});
