/*
 * 🦉 Bubo RSS Reader
 * ====
 * Dead simple feed reader that renders an HTML
 * page with links to content from feeds organized by site
 * 
 * Code: https://github.com/georgemandis/bubo-rss
 * Copyright (c) 2019 George Mandis (https://george.mand.is)
 * Version: 1.0.1 (11/14/2021)
 * Licensed under the MIT License (http://opensource.org/licenses/MIT)
 */

const fetch = require("node-fetch");
const Parser = require("rss-parser");
const parser = new Parser();

const nunjucks = require("nunjucks");
const env = nunjucks.configure({ autoescape: true });

const feeds = require("./feeds.json");

/**
 * Global filters for my Nunjucks templates
 */
env.addFilter("formatDate", function (dateString) {
  const formattedDate = new Date(dateString).toLocaleDateString()
  return formattedDate !== 'Invalid Date' ? formattedDate : dateString;
});

env.addGlobal('now', (new Date()).toUTCString());

// parse RSS/XML or JSON feeds
function parseFeed(response) {
  const contentType = response.headers.get("content-type")
    ? response.headers.get("content-type").split(";")[0]
    : false;

  const rssFeed = [contentType]
    .map(item =>
      [
        "application/atom+xml",
        "application/rss+xml",
        "application/xml",
        "text/xml",
        "text/html" // this is kind of a gamble
      ].includes(item)
        ? response.text()
        : false
    )
    .filter(_ => _)[0];

  const jsonFeed = [contentType]
    .map(item =>
      ["application/json", "application/feed+json"].includes(item) ? response.json() : false
    )
    .filter(_ => _)[0];

  return rssFeed || jsonFeed || false;
}

/*
  There's a little inconcistency with how feeds report certain things like
  title, links and timestamps. These helpers try to normalize that bit and
  provide an order-of-operations list of properties to look for.

  Note: these are tightly-coupled to the template and a personal preference.
*/

const getLink = (obj) => {
  const link_values = ["link", "url", "guid", "home_page_url"];
  const keys = Object.keys(obj);
  const link_property = link_values.find(link_value => keys.includes(link_value));
  return obj[link_property];
}


// fallback to URL for the title if not present (coupled to my template)
const getTitle = (obj) => {
  const title_values = ["title", "url", "link"]; // fallback to url/link as title if omitted
  const keys = Object.keys(obj);
  const title_property = title_values.find(title_value => keys.includes(title_value));
  return obj[title_property];
}

// More dependable way to get timestamps
const getTimestamp = (obj) => {
  const timestamp = new Date(obj.pubDate || obj.isoDate || obj.date || obj.date_published).getTime();
  return isNaN(timestamp) ? (obj.pubDate || obj.isoDate || obj.date || obj.date_published) : timestamp;
}

// fetch the feeds and build the object for our template
(async () => {
  const contentFromAllFeeds = {};
  const errors = [];

  for (group in feeds) {
    contentFromAllFeeds[group] = [];

    for (let index = 0; index < feeds[group].length; index++) {
      try {
        const response = await fetch(feeds[group][index]);
        const body = await parseFeed(response);
        const contents =
          typeof body === "string" ? await parser.parseString(body) : body;

        contents.feed = feeds[group][index];
        contents.title = getTitle(contents);
        contents.link = getLink(contents);
        contentFromAllFeeds[group].push(contents);

        // try to normalize date attribute naming
        contents?.items?.forEach(item => {
          item.timestamp = getTimestamp(item);
          item.title = getTitle(item);
          item.link = getLink(item);
        });

      } catch (error) {
        errors.push(feeds[group][index]);
      }
    }
  }

  const output = env.render("./src/template.html", {
    data: contentFromAllFeeds,
    errors: errors
  });
  console.log(output);
})();