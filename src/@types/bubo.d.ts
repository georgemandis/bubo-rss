export interface ContentFromAllFeeds {
  [key: string]: object[]
}

export interface Feeds {
  [key: string]: FeedItem
}

export interface FeedItem {
  [key: string]: string | number | Date | FeedItem[];
  items: FeedItem[]
}

//NEW WAY
export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;