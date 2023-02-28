/**
 * 
 * @param {!string} query 
 * @param {number=} maxResults 
 * @returns {!Promise<!Array<!{ title: !string, body: !string, href: !string }>>}
 */
export async function search(query, maxResults = 7) {
  const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`);
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const results = Array.from(doc.querySelectorAll(".result")).slice(0, maxResults);
  const searchResults = [];
  for (const result of results) {
    const title = result.querySelector(".result__title").textContent.trim();
    const body = result.querySelector(".result__snippet").textContent.trim();
    const href = decodeURIComponent(result.querySelector(".result__a").href.substring("https://duckduckgo.com/l/?uddg=".length));
    searchResults.push({ title, body, href });
  }

  return searchResults;
}