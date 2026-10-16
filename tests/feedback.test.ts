import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { POST } from "../app/api/feedback/route";
import { FEEDBACK_COLLECTION } from "../lib/feedback/store";

const input = { id: "fd2f2769-5ac6-4b96-b509-7f26e60f5e66", satisfaction: "satisfied", topic: "results", message: "Hasilnya membantu." };
const request = (body: unknown, origin = "http://localhost") => new Request("http://localhost/api/feedback", {
  method: "POST", headers: { "Content-Type": "application/json", origin }, body: JSON.stringify(body),
});

test("feedback rejects invalid inputs before reaching storage", async () => {
  assert.equal((await POST(request(input, "https://another-origin.invalid"))).status, 403);
  assert.equal((await POST(request({ ...input, satisfaction: "unknown" }))).status, 422);
  assert.equal((await POST(request({ ...input, message: "a".repeat(2001) }))).status, 422);
  assert.equal((await POST(request({ ...input, quizAnswers: { q1: 5 } }))).status, 422);
  assert.equal((await POST(request({ ...input, message: "a".repeat(12001) }))).status, 413);
  assert.equal((await POST(new Request("http://localhost/api/feedback", { method: "POST", body: "{" }))).status, 400);
});

test("feedback persists to its own collection and reports storage failures honestly", async () => {
  let exists = false;
  let failWrites = false;
  const points = new Map<string, { payload: Record<string, unknown>; vector: unknown }>();
  const server = createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : null;
    let result: unknown = true;
    if (req.url === "/") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ title: "qdrant - vector search engine", version: "1.19.0" }));
      return;
    }
    assert.ok(req.url?.startsWith(`/collections/${FEEDBACK_COLLECTION}`));
    if (req.url?.endsWith("/exists")) result = { exists };
    else if (req.url?.includes("/points")) {
      assert.ok(req.url.includes("wait=true"));
      if (failWrites) { res.writeHead(503, { "Content-Type": "application/json" }); res.end(JSON.stringify({ status: { error: "unavailable" } })); return; }
      for (const point of body.points) points.set(point.id, point);
      result = { operation_id: 1, status: "completed" };
    } else {
      assert.deepEqual(body.vectors, {});
      exists = true;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ result, status: "ok", time: 0 }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const previousUrl = process.env.QDRANT_URL;
  process.env.QDRANT_URL = `http://127.0.0.1:${address.port}`;
  try {
    assert.equal((await POST(request(input))).status, 201);
    assert.equal((await POST(request(input))).status, 201);
    assert.equal(points.size, 1, "retry should update the same point");
    assert.deepEqual(points.get(input.id)?.vector, {});
    assert.equal(points.get(input.id)?.payload.message, input.message);
    assert.equal(points.get(input.id)?.payload.source, "quiz/results");
    failWrites = true;
    const failed = await POST(request({ ...input, message: "Retry me" }));
    assert.equal(failed.status, 503);
    assert.ok((await failed.json()).error.includes("belum terkirim"));
  } finally {
    if (previousUrl === undefined) delete process.env.QDRANT_URL;
    else process.env.QDRANT_URL = previousUrl;
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
