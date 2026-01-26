import * as cheerio from "cheerio";

export const extractTextFromHTML = (html) => {
  const $ = cheerio.load(html);

  $("script, style, nav, footer, header, noscript").remove();

  const text = $("body").text();
  return text.replace(/\s+/g, " ").trim();
};
