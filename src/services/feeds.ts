import Parser from "rss-parser";

interface FeedItem {
	title: string;
	feedName: string;
	feedLink: string;
	pubIsoDate: number;
	link: string;
	category: string;
}

const MAX_CONNECTIONS = Number.POSITIVE_INFINITY;
const DELAY_MS = 850;
const parser = new Parser();

function readFeedCategoriesFromEnv(): Record<string, string[]> {
	if (import.meta.env.FEEDS) {
		return JSON.parse(import.meta.env.FEEDS);
	}
	throw new Error("FEEDS environment variable is not set");
}

async function getRawFeedContents(response: Response): Promise<unknown> {
	const contentType = response.headers.get("content-type")?.split(";")[0];
	if (!contentType) return {};
	if (
		[
			"application/atom+xml",
			"application/rss+xml",
			"application/xml",
			"text/xml",
			"text/html",
		].includes(contentType)
	) {
		return response.text();
	}
	if (["application/json", "application/feed+json"].includes(contentType)) {
		return response.json();
	}
	return {};
}

interface RawFeedItem {
	creator?: string;
	title: string;
	link: string;
	pubDate: string;
	"content:encoded"?: string;
	"content:encodedSnippet"?: string;
	"dc:creator"?: string;
	comments?: string;
	content: string;
	contentSnippet: string;
	guid: string;
	categories: unknown[];
	isoDate: string;
	[other: string]: unknown;
}

interface RawFeed {
	items: RawFeedItem[];
	feedUrl?: string;
	image?: {
		link: string;
		url: string;
		title: string;
		width: string;
		height: string;
	};
	pagenationLinks?: {
		self: string;
		next: string;
	};
	title: string;
	description: string;
	generator: string;
	link: string;
	language?: string;
	lastBuildDate?: string;
	[other: string]: unknown;
}

function getTitle(item: RawFeed | RawFeedItem): string {
	const titleValues: (keyof RawFeed | keyof RawFeedItem)[] = [
		"title",
		"url",
		"link",
	];
	const keys = Object.keys(item);
	const titleProperty = titleValues.find(
		(titleValue) => keys.includes(titleValue) && item[titleValue],
	);
	return titleProperty ? (item[titleProperty] as string) : "";
}

function getLink(item: RawFeed | RawFeedItem): string {
	const linkValues: (keyof RawFeed | keyof RawFeedItem)[] = [
		"link",
		"url",
		"guid",
		"home_page_url",
	];
	const keys = Object.keys(item);
	const linkProperty = linkValues.find((linkValue) => keys.includes(linkValue));
	return linkProperty ? (item[linkProperty] as string) : "";
}

function getTimestamp(item: RawFeedItem): number {
	const dateString =
		item.pubDate || item.isoDate || item.date || item.date_published;
	if (!dateString || typeof dateString !== "string") {
		return Date.now();
	}
	const timestamp = new Date(dateString).getTime();
	return Number.isNaN(timestamp) ? Date.now() : timestamp;
}

async function parseFeedContents(
	feedUrl: string,
	category: string,
): Promise<FeedItem[]> {
	console.log(`Fetching: ${feedUrl}...`);
	const response = await fetch(feedUrl);
	const body = await getRawFeedContents(response);
	if (!body) {
		throw new Error(`Failed to fetch feed: ${feedUrl}`);
	}
	try {
		const rawFeed = (
			typeof body === "string" ? await parser.parseString(body) : body
		) as RawFeed;
		const feedName = getTitle(rawFeed);
		const feedLink = getLink(rawFeed);
		const items: FeedItem[] = rawFeed.items.flatMap((item) => ({
			feedName,
			feedLink,
			category,
			title: item.title,
			pubIsoDate: getTimestamp(item),
			link: item.link,
		}));
		return items;
	} catch (err) {
		console.error(`Error processing: ${feedUrl}\n${err}`);
		throw err;
	}
}

export default async function getAllFeedItems(): Promise<{
	contents: FeedItem[];
	errors: Error[];
}> {
	const feedCategories = readFeedCategoriesFromEnv();

	const results = (
		await Promise.allSettled(
			Object.entries(feedCategories)
				.flatMap(([category, feeds]) =>
					feeds.map((feedUrl) => ({ category, feedUrl })),
				)
				.flatMap(({ category, feedUrl }) => {
					return parseFeedContents(feedUrl, category);
				}),
		)
	).reduce(
		(acc, result) => {
			if (result.status === "fulfilled") {
				acc.contents.push(...result.value);
			} else {
				acc.errors.push(result.reason);
			}
			return acc;
		},
		{ contents: [], errors: [] },
	);
	results.contents.sort((a, b) => b.pubIsoDate - a.pubIsoDate);
	return results;
}
