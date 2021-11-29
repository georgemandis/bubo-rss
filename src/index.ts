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
// calculate the total number of feeds to we can throttle
const feedListLength = Object.entries(feedList).flat(2).length - Object.keys(feedList).length;
const contentFromAllFeeds: Feeds = {};
const errors: unknown[] = [];
const allFetches: Promise<boolean | void | undefined>[] = [];
const initTime = Date.now();
const benchmark = (startTime: number) => chalk.cyanBright.bold(`(${(Date.now() - startTime) / 1000} seconds)`);

// used to throttle fetches
const MAX_CONNECTIONS = Infinity;
const DELAY_MS = 850;

const error = chalk.bold.red;
const success = chalk.bold.green;

let completed = 0;

const finishBuild: () => void = async () => {
  console.log("\nDone fetching everything!");

  // generate the static HTML output from our template renderer
  const output = render({
    data: contentFromAllFeeds,
    errors: errors
  });

  // write the output to public/index.html
  await writeFile("./public/index.html", output);
  console.log(`Finished writing to output. ${benchmark(initTime)}`);
};

// process each feed and its content
const processFeed = (
  {
    group, feed, startTime
  }: { group: string; feed: string, startTime: number }
) => async (response: Response) => {
  const body = await parseFeed(response);
  completed++;
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
    console.log(`${success("Successfully fetched:")} ${feed} ${benchmark(startTime)}`);

  } catch (err) {
    console.log(`${error("Error processing:")} ${feed} ${benchmark(startTime)}`);
    errors.push(err);
  }

  // if this is the last feed, go ahead and build the output
  (completed === feedListLength - 1) && finishBuild();
};


let idx = 0;
// go through each group of feeds and process
for (const [group, feeds] of Object.entries(feedList)) {
  contentFromAllFeeds[group] = [];
  for (const feed of feeds) {
    const startTime = Date.now();
    setTimeout(() => {
      console.log(`Fetching: ${feed}...`);
      allFetches.push(
        fetch(feed).then(processFeed({ group, feed, startTime })).catch(err => {
          console.log(error(`Error fetching ${feed} ${benchmark(startTime)}`));
          errors.push(`Error fetching ${feed} ${err.toString()}`);
        })
      );
    }, (idx % (feedListLength / MAX_CONNECTIONS)) * DELAY_MS);
    idx++;
  }
}

