import { extract } from "@extractus/feed-extractor";

interface FeedItem {
	title: string;
	feedName: string;
	feedLink: string;
	pubIsoDate: number;
	link: string;
	category: string;
}

function readFeedCategoriesFromEnv(): Record<string, string[]> {
	if (import.meta.env.FEEDS) {
		return JSON.parse(import.meta.env.FEEDS);
	}
	throw new Error("FEEDS environment variable is not set");
}

async function parseFeedContents(
	feedUrl: string,
	category: string,
): Promise<FeedItem[]> {
	console.log(`Fetching: ${feedUrl}...`);
	let items: FeedItem[] = [];
	try {
		const result = await extract(feedUrl, {
			descriptionMaxLen: 1,
			useISODateFormat: false,
		});
		items = (result.entries ?? []).map((entry) => ({
			feedName: result.title,
			feedLink: result.link,
			category,
			title: entry.title,
			pubIsoDate: new Date(entry.published).getTime(),
			link: entry.link,
		}));
	} catch (err) {
		console.error(`${feedUrl}\n${err}`);
		throw err;
	}
	return items;
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
					return parseFeedContents(feedUrl, category).catch((err) => {
						let toThrow: Error;
						if (err instanceof Error) {
							err.message = `${feedUrl}: ${err.message}`;
							toThrow = err;
						} else {
							toThrow = new Error(`${feedUrl}: ${err}`);
						}
						return Promise.reject(toThrow);
					});
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
