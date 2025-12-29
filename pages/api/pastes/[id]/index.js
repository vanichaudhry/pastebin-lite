import clientPromise from "@/lib/mongodb";

import { ObjectId } from "mongodb";

function getNow(req) {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return new Date(Number(req.headers["x-test-now-ms"]));
  }
  return new Date();
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(404).json({ error: "Not found" });
  }

  const { id } = req.query;
  if (!ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Not found" });
  }

  const client = await clientPromise;
  const db = client.db("pastebin");
  const now = getNow(req);

  const paste = await db.collection("pastes").findOne({ _id: new ObjectId(id) });
  if (!paste) {
    return res.status(404).json({ error: "Not found" });
  }

  if (paste.expires_at && now > new Date(paste.expires_at)) {
    return res.status(404).json({ error: "Not found" });
  }

  if (paste.max_views !== null && paste.views_used >= paste.max_views) {
    return res.status(404).json({ error: "Not found" });
  }

  await db.collection("pastes").updateOne(
    { _id: paste._id },
    { $inc: { views_used: 1 } }
  );

  const remainingViews =
    paste.max_views === null ? null : Math.max(0, paste.max_views - (paste.views_used + 1));

  return res.status(200).json({
    content: paste.content,
    remaining_views: remainingViews,
    expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null
  });
}
