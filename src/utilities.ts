import { $ } from "bun";
/*
	There's a little inconsistency with how feeds report certain things like
	title, links and timestamps. These helpers try to normalize that bit and
	provide an order-of-operations list of properties to look for.

	Note: these are tightly-coupled to the template and a personal preference.
*/

import { readFile } from "node:fs/promises";
import type { Response } from "node-fetch";
import type { FeedItem, JSONValue } from "./@types/bubo";

export const getLink = (obj: FeedItem): string => {
	const link_values: string[] = ["link", "url", "guid", "home_page_url"];
	const keys: string[] = Object.keys(obj);
	const link_property: string | undefined = link_values.find((link_value) =>
		keys.includes(link_value),
	);
	return link_property ? (obj[link_property] as string) : "";
};

// fallback to URL for the title if not present
// (title -> url -> link)
export const getTitle = (obj: FeedItem): string => {
	const title_values: string[] = ["title", "url", "link"];
	const keys: string[] = Object.keys(obj);

	// if title is empty for some reason, fall back on url or link
	const title_property: string | undefined = title_values.find(
		(title_value) => keys.includes(title_value) && obj[title_value],
	);
	return title_property ? (obj[title_property] as string) : "";
};

// More dependable way to get timestamps
export const getTimestamp = (obj: FeedItem): string => {
	const dateString: string = (
		obj.pubDate ||
		obj.isoDate ||
		obj.date ||
		obj.date_published
	).toString();
	const timestamp: number = new Date(dateString).getTime();
	return Number.isNaN(timestamp) ? dateString : timestamp.toString();
};

// parse RSS/XML or JSON feeds
export async function parseFeed(response: Response): Promise<JSONValue> {
	const contentType = response.headers.get("content-type")?.split(";")[0];

	if (!contentType) return {};

	const rssFeed = [contentType]
		.map((item) =>
			[
				"application/atom+xml",
				"application/rss+xml",
				"application/xml",
				"text/xml",
				"text/html", // this is kind of a gamble
			].includes(item)
				? response.text()
				: false,
		)
		.filter((_) => _)[0];

	const jsonFeed = [contentType]
		.map((item) =>
			["application/json", "application/feed+json"].includes(item)
				? (response.json() as Promise<JSONValue>)
				: false,
		)
		.filter((_) => _)[0];

	return (rssFeed && rssFeed) || (jsonFeed && jsonFeed) || {};
}

export const getFeedList = async ({
	feedFilePath,
	feeds,
}: { feedFilePath?: string; feeds?: string }): Promise<JSONValue> => {
	if (feeds) {
		return JSON.parse(feeds);
	}
	if (!feedFilePath) {
		throw new Error("No feed list provided");
	}
	return JSON.parse(
		(await readFile(new URL(feedFilePath, import.meta.url))).toString(),
	);
};

export const getBuboInfo = async (): Promise<JSONValue> => {
	return JSON.parse(
		(await readFile(new URL("../package.json", import.meta.url))).toString(),
	);
};

export const buildCSS = async (
	minify: boolean,
	input: string,
	destination: string,
): Promise<void> => {
	const output =
		await $`bun x tailwindcss -i ${input} ${minify ? "--minify" : ""} -o ${destination}`;
	if (output.exitCode !== 0) {
		const err = new TextDecoder().decode(output.stderr);
		throw new Error(`Building tailwind failed: ${err}`);
	}
	console.log(`Successfully built CSS to ${destination}`);
	return;
};
