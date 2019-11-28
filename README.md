# 🦉 Bubo Reader

Bubo Reader is a somewhat irrationally minimalist <acronym title="Really Simple Syndication">RSS</acronym> and <acronym title="JavaScript Object Notation">JSON</acronym> feed reader you can deploy on [Netlify](https://netlify.com) in a few steps. The goal of the project is to generate a webpage that shows a list of links from a collection of feeds organized by category and website. That's it. 

It is named after this [silly robot owl](https://www.youtube.com/watch?v=MYSeCfo9-NI) from Clash of the Titans (1981).

You can read more about how this project came about in my blog post '[Introducing Bubo RSS: An Absurdly Minimalist RSS Feed Reader](https://george.mand.is/2019/11/introducing-bubo-rss-an-absurdly-minimalist-rss-feed-reader/)'

## Getting Started

How to use Bubo Reader in a few easy steps with GitHub and Netlify:

### Deploying from GitHub to Netlify

- [Fork the repository](https://github.com/georgemandis/bubo-rss/fork)
- From your forked repository go to and edcit `src/feeds.json` to manage your feeds and categories
- [Create a new site](https://app.netlify.com/start) on Netlify from GitHub 

The deploy settings should automatically import from the `netlify.toml` file. All you'll need to do is confirm and you're ready to go!

### Keeping Feeds Updated

To keep your feeds up to date you'll want to [setup a Build Hook](https://www.netlify.com/docs/webhooks/#incoming-webhooks) for your Netlify site and use another service to ping it every so often to trigger a rebuild. I'd suggeste looking into:

- [IFTTT](https://ifttt.com/)
- [Zapier](https://zapier.com/)
- [EasyCron](https://www.easycron.com/)

If you already have a server running Linux and some command-line experience it might be simpler to setup a [cron job](https://en.wikipedia.org/wiki/Cron). 

## Anatomy of Bubo Reader

- `src/index.html` - a [Nunjucks](https://mozilla.github.io/nunjucks/) template that lets you change how the feeds are displayed
- `output/style.css` - a CSS file to stylize your feed output
- `src/feeds.json` - a JSON file containing the URLs for various site's feeds separated into categories
- `src/index.js` - the script that loads the feeds and does the actual parsinga and rendering

## Support

If you found this useful please consider sponsoring me or this project. If you'd rather run this on your own server please consider using one of these affiliate links to setup a micro instance on [Linode](https://www.linode.com/?r=8729957ab02b50a695dcea12a5ca55570979d8b9) or [Digital Ocean](https://m.do.co/c/31f58d367777).
 