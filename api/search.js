// /api/search.js
const AVTRDB_BASE = "https://api.avtrdb.com/v2/avatar/search/vrcx?search=";

function getInt(value, fallback, min, max) {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

async function fetchJson(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "accept": "application/json, text/plain, */*",
        "user-agent": "VRC-Search/1.0"
      }
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Upstream ${res.status}`);

    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

function normalize(item) {
  return {
    id: item.id || item.avatarId || "",
    name: item.name || item.avatarName || "Untitled",
    author
