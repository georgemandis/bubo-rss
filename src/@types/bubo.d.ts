export interface ContentFromAllFeeds {
  [key: string]: object[]
}

export interface Feeds {
  [key: string]: FeedItem
}

export interface FeedItem {
  [key: string]: string | FeedItem[];
}