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
import { Feeds, FeedItem } from "./@types/bubo";
import { Response } from "node-fetch";
import { render } from "./renderer.js";
import { getLink, getTitle, getTimestamp, parseFeed, getFeedList } from "./utilities.js";
import { writeFile } from "fs/promises";
import chalk from "chalk";

const parser = new Parser();
const feedList = await getFeedList();
const contentFromAllFeeds: Feeds = {};
const errors: unknown[] = [];
const allFetches = [];


const error = chalk.bold.red;
const success = chalk.bold.green;
const time = chalk.cyanBright.bold;


// process each feed and its content
const processFeed = (
  {
    group, feed, startTime
  }: { group: string; feed: string, startTime: number }
) => async (response: Response) => {
  const body = await parseFeed(response);

  // skip to the next one if this didn't work out
  if (!body) return;

  try {
    const contents: FeedItem =
      (typeof body === "string" ? (await parser.parseString(body)) : body) as FeedItem;

    contents.feed = feed;
    contents.title = getTitle(contents);
    contents.link = getLink(contents);

    // try to normalize date attribute naming
    contents?.items?.forEach((item) => {
      item.timestamp = getTimestamp(item);
      item.title = getTitle(item);
      item.link = getLink(item);
    });
    contentFromAllFeeds[group].push(contents as object);
    console.log(`${success("Successfully fetched:")} ${feed}`, time(`(${((Date.now() - startTime) / 1000)} seconds)`));
    return true;
  } catch (err) {
    console.log(`${error("Error processing:")} ${feed} (${((Date.now() - startTime) / 1000)} seconds)`);
    errors.push(err);
    return false;
  }

};


// go through each group of feeds and process them
for (const [group, feeds] of Object.entries(feedList)) {
  contentFromAllFeeds[group] = [];

  for (const feed of feeds) {
    console.log(`Fetching ${feed}...`);
    const startTime = Date.now();
    allFetches.push(
      fetch(feed).then(processFeed({ group, feed, startTime })).catch(err => {
        console.log(error(`Error fetching ${feed} (${((Date.now() - startTime) / 1000)} seconds)`));
        errors.push(`Error fetching ${feed} ${err.toString()}`);
      })
    );
  }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
Promise.all(allFetches).then(async () => {
  console.log("\nDone fetching everything!");
  // generate the static HTML output from our template renderer
  const output = render({
    data: contentFromAllFeeds,
    errors: errors
  });

  // write the output to public/index.html
  await writeFile("./public/index.html", output);

});

