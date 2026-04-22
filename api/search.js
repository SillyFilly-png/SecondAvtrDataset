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

    // Normalize structure
    const items = Array.isArray(data) ? data : (data.results || []);

    const clean = items.map(a => ({
      id: a.id,
      name: a.name,
      image: a.thumbnailImageUrl
    }));

    res.status(200).json(clean);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch avatars" });
  }
}
