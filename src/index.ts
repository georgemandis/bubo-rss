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

import { writeFile } from "node:fs/promises";
import chalk from "chalk";
import fetch from "node-fetch";
import type { Response } from "node-fetch";
import Parser from "rss-parser";
import type { FeedItem, Feeds } from "./@types/bubo";
import { render } from "./renderer.js";
import {
	getBuboInfo,
	getFeedList,
	getLink,
	getTimestamp,
	getTitle,
	parseFeed,
} from "./utilities.js";

const buboInfo = await getBuboInfo();
const parser = new Parser();
const feedList = await getFeedList();
const feedListLength =
	Object.entries(feedList).flat(2).length - Object.keys(feedList).length;

/**
 * contentFromAllFeeds = Contains normalized, aggregated feed data and is passed to template renderer at the end
 * errors = Contains errors from parsing feeds and is also passed to template.
 */
const contentFromAllFeeds: Feeds = {};
const errors: unknown[] = [];

// benchmarking data + utility
const initTime = Date.now();
const benchmark = (startTime: number) =>
	chalk.cyanBright.bold(`${(Date.now() - startTime) / 1000} seconds`);

/**
 * These values are used to control throttling/batching the fetches:
 *  - MAX_CONNECTION = max number of fetches to contain in a batch
 *  - DELAY_MS = the delay in milliseconds between batches
 */
const MAX_CONNECTIONS = Number.POSITIVE_INFINITY;
const DELAY_MS = 850;

const error = chalk.bold.red;
const success = chalk.bold.green;

// keeping tally of total feeds fetched and parsed so we can compare
// to feedListLength and know when we're finished.
let completed = 0;

/**
 * finishBuild
 * --
 * function that gets called when all the feeds are through fetching
 * and we want to build the static output.
 */
const finishBuild: () => void = async () => {
	completed++;
	// if this isn't the last feed, just return early
	if (completed !== feedListLength) return;

	process.stdout.write("\nDone fetching everything!\n");

	// sort all the categories and the feeds alphabetically
	const sortedFeeds: Feeds = {};
	const sortedKeys = Object.keys(contentFromAllFeeds).sort((a, b) =>
		a.localeCompare(b),
	);
	for (const key of sortedKeys) {
		sortedFeeds[key] = contentFromAllFeeds[key].sort((a, b) =>
			a.title.localeCompare(b.title),
		);
	}

	const yazzyUrl = process.env.YAZZY_URL;
	process.stdout.write(`\nUsing yazzy url: "${yazzyUrl}"\n`);
	// generate the static HTML output from our template renderer
	const output = render({
		data: sortedFeeds,
		errors: errors,
		info: buboInfo,
		yazzyUrl
	});

	// write the output to public/index.html
	await writeFile("./public/index.html", output);
	process.stdout.write(
		`\nFinished writing to output:\n- ${feedListLength} feeds in ${benchmark(
			initTime,
		)}\n- ${errors.length} errors\n`,
	);
};

/**
 * processFeed
 * --
 * Process an individual feed and normalize its items
 * @param { group, feed, startTime}
 * @returns Promise<void>
 */
const processFeed =
	({
		group,
		feed,
		startTime,
	}: {
		group: string;
		feed: string;
		startTime: number;
	}) =>
	async (response: Response): Promise<void> => {
		const body = await parseFeed(response);
		//skip to the next one if this didn't work out
		if (!body) return;

		try {
			const contents: FeedItem = (
				typeof body === "string" ? await parser.parseString(body) : body
			) as FeedItem;

			contents.feed = feed;
			contents.title = getTitle(contents);
			contents.link = getLink(contents);

			// try to normalize date attribute naming
			for (const item of contents.items) {
				item.timestamp = getTimestamp(item);
				item.title = getTitle(item);
				item.link = getLink(item);
				const timestamp = new Date(Number.parseInt(item.timestamp));
				const eightHoursAgo = new Date();
				eightHoursAgo.setHours(eightHoursAgo.getHours() - 8);
				item.isRecent = timestamp > eightHoursAgo;
			}

			contents.hasRecent = contents.items.some((item) => item.isRecent);

			contentFromAllFeeds[group].push(contents as object);
			process.stdout.write(
				`${success("Successfully fetched:")} ${feed} - ${benchmark(startTime)}\n`,
			);
		} catch (err) {
			process.stdout.write(
				`${error("Error processing:")} ${feed} - ${benchmark(
					startTime,
				)}\n${err}\n`,
			);
			errors.push(`Error processing: ${feed}\n\t${err}`);
		}

		finishBuild();
	};

// go through each group of feeds and process
const processFeeds = () => {
	let idx = 0;

	for (const [group, feeds] of Object.entries(feedList)) {
		contentFromAllFeeds[group] = [];

		for (const feed of feeds) {
			const startTime = Date.now();
			setTimeout(
				() => {
					process.stdout.write(`Fetching: ${feed}...\n`);

					fetch(feed)
						.then(processFeed({ group, feed, startTime }))
						.catch((err) => {
							process.stdout.write(
								error(`Error fetching ${feed} ${benchmark(startTime)}\n`),
							);
							errors.push(`Error fetching ${feed} ${err.toString()}\n`);
							finishBuild();
						});
				},
				(idx % (feedListLength / MAX_CONNECTIONS)) * DELAY_MS,
			);
			idx++;
		}
	}
};

processFeeds();
