import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";

export const COLLECTION = process.env.QDRANT_COLLECTION || "fyp_university_programs_v1";
export const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
export const LLM_MODEL = process.env.OPENAI_RECOMMENDATION_MODEL || "gpt-4o-mini";
export const VECTOR_SIZE = 512;

export function openaiClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30_000, maxRetries: 1 });
}

export function qdrantClient() {
  const endpoint = process.env.QDRANT_URL || process.env.QDRANT_CLOUD_CLUSTER_ENDPOINT || "http://localhost:6333";
  const url = /^https?:\/\//.test(endpoint) ? endpoint : `https://${endpoint}`;
  return new QdrantClient({
    url,
    apiKey: process.env.QDRANT_API_KEY || process.env.QDRANT_CLOUD_API_KEY,
    timeout: 30_000,
  });
}
