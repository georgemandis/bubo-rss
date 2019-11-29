/**
 * 🦉 Bubo RSS Reader
 * ====
 * Dead, dead simple feed reader that renders an HTML
 * page with links to content from feeds organized by site
 *
 */

const fetch = require("node-fetch");
const Parser = require("rss-parser");
const parser = new Parser();

const nunjucks = require("nunjucks");
const env = nunjucks.configure({ autoescape: true });

const feeds = require("./feeds.json");

env.addFilter("formatDate", function(dateString) {
  const formattedDate = new Date(dateString).toLocaleDateString()
  return formattedDate !== 'Invalid Date' ? formattedDate : dateString;
});

env.addGlobal('now', (new Date()).toUTCString() );

// parse XML or JSON feeds
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
      ["application/json"].includes(item) ? response.json() : false
    )
    .filter(_ => _)[0];

  return rssFeed || jsonFeed || false;
}

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
        contents.title = contents.title ? contents.title : contents.link;
        contentFromAllFeeds[group].push(contents);
        
        // try to normalize date attribute naming
        contents.items.forEach(item => {
          const timestamp = new Date(item.pubDate || item.isoDate || item.date).getTime();          
          item.timestamp = isNaN(timestamp) ? (item.pubDate || item.isoDate || item.date) : timestamp;
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
