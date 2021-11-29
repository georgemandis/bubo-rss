export interface Feeds {
  [key: string]: object[]
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