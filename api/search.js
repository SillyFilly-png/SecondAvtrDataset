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
          "accept": "application/json",
          "user-agent": "Mozilla/5.0"
        }
      }
    );

    const text = await r.text();

    // detect non-json responses
    if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
      return res.status(500).json({
        error: "AVTRDB did not return JSON",
        preview: text.slice(0, 200)
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "Invalid JSON parse",
        preview: text.slice(0, 200)
      });
    }

    const items = Array.isArray(data) ? data : (data.results || []);

    return res.status(200).json(
      items.map(a => ({
        id: a.id || "",
        name: a.name || "Untitled",
        author: a.authorName || "Unknown",
        image: a.thumbnailImageUrl || ""
      }))
    );

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
