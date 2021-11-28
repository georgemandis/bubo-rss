/*
  There's a little inconcistency with how feeds report certain things like
  title, links and timestamps. These helpers try to normalize that bit and
  provide an order-of-operations list of properties to look for.

  Note: these are tightly-coupled to the template and a personal preference.
*/

import { Response } from "node-fetch";
import { readFile } from "fs/promises";

export const getLink = (obj: { [key: string]: string }): string => {
  const link_values: string[] = ["link", "url", "guid", "home_page_url"];
  const keys: string[] = Object.keys(obj);
  const link_property: string | undefined = link_values.find(link_value => keys.includes(link_value));
  return link_property ? obj[link_property] : "";
};


// fallback to URL for the title if not present (coupled to my template)
export const getTitle = (obj: { [key: string]: string }): string => {
  const title_values: string[] = ["title", "url", "link"]; // fallback to url/link as title if omitted
  const keys: string[] = Object.keys(obj);
  const title_property: string | undefined = title_values.find(title_value => keys.includes(title_value));
  return title_property ? obj[title_property] : "";
};

// More dependable way to get timestamps
export const getTimestamp = (obj: { [key: string]: string }): string => {
  const timestamp: number = new Date(obj.pubDate || obj.isoDate || obj.date || obj.date_published).getTime();
  return isNaN(timestamp) ? (obj.pubDate || obj.isoDate || obj.date || obj.date_published) : timestamp.toString();
};


// parse RSS/XML or JSON feeds
export async function parseFeed(response: Response): Promise<{ [key: string]: string } | unknown> {
  const contentType = response.headers.get("content-type")?.split(";")[0];

  if (!contentType) return {};

  const rssFeed = [contentType]
    .map(item =>
      [
        "application/atom+xml",
        "application/rss+xml",
        "application/xml",
        "text/xml",
        "text/html" // this is kind of a gamble
      ].includes(item)
        ? response.text()
        : false
    )
    .filter(_ => _)[0];

  const jsonFeed = [contentType]
    .map(item =>
      ["application/json", "application/feed+json"].includes(item) ? response.json() : false
    )
    .filter(_ => _)[0];

  return (rssFeed && rssFeed) || (jsonFeed && jsonFeed) || {};
}


export const getFeedList = async (): Promise<string> => {
  return JSON.parse(
    (await readFile(
      new URL("../config/feeds.json", import.meta.url)
    )).toString()
  );
};

