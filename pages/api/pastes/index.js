import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Not found" });
  }

  const { content, ttl_seconds, max_views } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "content is required" });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "ttl_seconds must be an integer >= 1" });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "max_views must be an integer >= 1" });
  }

  const client = await clientPromise;
  const db = client.db("pastebin");

  const now = new Date();

  const paste = {
    content,
    created_at: now,
    expires_at: ttl_seconds ? new Date(now.getTime() + ttl_seconds * 1000) : null,
    max_views: max_views ?? null,
    views_used: 0
  };

  const result = await db.collection("pastes").insertOne(paste);

  return res.status(201).json({
    id: result.insertedId.toString(),
    url: `http://localhost:3000/p/${result.insertedId}`
  });
}
