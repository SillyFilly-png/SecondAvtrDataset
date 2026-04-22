export default async function handler(req, res) {
  const { query } = req.query;

  try {
    // Example sources (replace with real endpoints)
    const sources = [
      fetch(`https://api.avtrdb.com/search?q=${query}`).then(r => r.json()),
      fetch(`https://api.avtr.zip/search?q=${query}`).then(r => r.json())
    ];

    const results = await Promise.allSettled(sources);

    // Normalize results
    const merged = results.flatMap(r => {
      if (r.status !== "fulfilled") return [];

      return r.value.map(item => ({
        name: item.name || item.title,
        image: item.image || item.thumbnail,
        author: item.author || "Unknown",
        source: item.source || "unknown",
        download: item.download || item.url
      }));
    });

    res.status(200).json(merged);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
}
