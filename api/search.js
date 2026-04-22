export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Missing query" });
  }

  try {
    const response = await fetch(
      `https://api.avtrdb.com/v2/avatar/search?query=${encodeURIComponent(q)}`
    );

    const data = await response.json();

    const items = Array.isArray(data) ? data : (data.results || []);

    const cleaned = items.map(a => ({
      id: a.id,
      name: a.name,
      image: a.thumbnailImageUrl
    }));

    res.status(200).json(cleaned);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
}
