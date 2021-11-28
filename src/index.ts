/*
 * 🦉 Bubo Reader
 * ====
 * Dead simple feed reader (RSS + JSON) that renders an HTML
 * page with links to content from feeds organized by site
 *
 * Code: https://github.com/georgemandis/bubo-rss
 * Copyright (c) 2019 George Mandis (https://george.mand.is)
 * Version: 1.0.1 (11/14/2021)
 * Licensed under the MIT License (http://opensource.org/licenses/MIT)
 */

import fetch from "node-fetch";
import Parser from "rss-parser";
import { ContentFromAllFeeds, FeedItem } from "./@types/bubo";
import { render } from "./renderer.js";
import { getLink, getTitle, getTimestamp, parseFeed, getFeedList } from "./utilities.js";

const DEBUG = false;

const parser = new Parser();
const feedList = await getFeedList();
const contentFromAllFeeds: ContentFromAllFeeds = {};
const errors = [];

for (const [group, feeds] of Object.entries(feedList)) {
  contentFromAllFeeds[group] = [];

  for (const feed of feeds) {
    try {

      const response = await fetch(feed);
      const body = await parseFeed(response);

      // skip to the next one if this didn't work out
      if (!body) continue;

      const contents: FeedItem =
        (typeof body === "string" ? (await parser.parseString(body)) : body) as FeedItem;

      contents.feed = feed;
      contents.title = getTitle(contents);
      contents.link = getLink(contents);
      contentFromAllFeeds[group].push(contents as object);

      // try to normalize date attribute naming
      contents?.items?.forEach((item) => {
        item.timestamp = getTimestamp(item);
        item.title = getTitle(item);
        item.link = getLink(item);
      });

    } catch (error) {
      errors.push(feed);
    }
  }
}

// generate the static HTML output from our template renderer
const output = render({
  data: contentFromAllFeeds,
  errors: errors
});

// return the rendered console and save it somewhere.
if (!DEBUG) {
  console.log(output);
}

