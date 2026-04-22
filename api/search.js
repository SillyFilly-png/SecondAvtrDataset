export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const r = await fetch(
      `https://api.avtrdb.com/v2/avatar/search?query=${encodeURIComponent(q)}`,
      {
        headers: {
          "accept": "application/json"
        }
      }
    );

    const text = await r.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Bad JSON from AVTRDB", raw: text });
    }

    const items = Array.isArray(data) ? data : (data.results || []);

    const cleaned = items.map(a => ({
      id: a.id || "",
      name: a.name || "Untitled",
      author: a.authorName || "Unknown",
      image: a.thumbnailImageUrl || ""
    }));

    res.status(200).json(cleaned);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
