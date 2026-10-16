import { qdrantClient, COLLECTION } from "../university/clients";
import type { AppFeedback } from "./schema";

export const FEEDBACK_COLLECTION = process.env.QDRANT_FEEDBACK_COLLECTION || "fyp_app_feedback_v1";

export async function saveFeedback(feedback: AppFeedback) {
  if (FEEDBACK_COLLECTION === COLLECTION) throw new Error("Feedback collection must be separate from university data");
  const client = qdrantClient();
  if (!(await client.collectionExists(FEEDBACK_COLLECTION)).exists) {
    try {
      await client.createCollection(FEEDBACK_COLLECTION, { vectors: {} });
    } catch (error) {
      // Another request may have created the collection concurrently.
      if (!(await client.collectionExists(FEEDBACK_COLLECTION)).exists) throw error;
    }
  }
  await client.upsert(FEEDBACK_COLLECTION, {
    wait: true,
    points: [{
      id: feedback.id,
      vector: {},
      payload: {
        satisfaction: feedback.satisfaction,
        topic: feedback.topic,
        message: feedback.message,
        source: "quiz/results",
        createdAt: new Date().toISOString(),
      },
    }],
  });
}
