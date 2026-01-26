import axios from "axios";
import * as cheerio from "cheerio";
import { extractTextFromHTML } from "./htmlParser.js";

export const crawlWebsite = async (
  url,
  maxDepth = 2,
  visited = new Set(),
  depth = 0
) => {
  if (visited.has(url) || depth > maxDepth) return [];

  visited.add(url);

  let results = [];

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const text = extractTextFromHTML(response.data);
    console.log("Extracted text length:", text.length);
    if (text.length > 50) results.push(text);

    const $ = cheerio.load(response.data);

    const baseUrl = new URL(url).origin;

    const links = $("a[href]")
      .map((_, el) => $(el).attr("href"))
      .get()
      .filter(
        (link) =>
          link &&
          (link.startsWith("/") || link.startsWith(baseUrl))
      )
      .slice(0, 5); // ❗ limit links

    for (const link of links) {
      const fullUrl = link.startsWith("/")
        ? `${baseUrl}${link}`
        : link;

      const subResults = await crawlWebsite(
        fullUrl,
        maxDepth,
        visited,
        depth + 1
      );

      results.push(...subResults);
    }
  } catch (err) {
    console.error("Crawl error:", url);
  }

  return results;
};
