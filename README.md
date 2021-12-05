[![Netlify Status](https://api.netlify.com/api/v1/badges/81dd219c-51cb-4418-a18c-42c8b104c689/deploy-status)](https://app.netlify.com/sites/bubo-rss-demo/deploys)

# 🦉 Bubo Reader (2.0)

Bubo Reader is a hyper-minimalist <acronym title="Really Simple Syndication">RSS</acronym> and <acronym title="JavaScript Object Notation">JSON</acronym> feed reader you can deploy on your own server, [Netlify](https://netlify.com) in a few steps or [Glitch](https://glitch.com) in even fewer steps! The goal of the project is to generate a webpage that shows a list of links from a collection of feeds organized by category and website. That's it.

It is named after this [silly robot owl](https://www.youtube.com/watch?v=MYSeCfo9-NI) from Clash of the Titans (1981).

You can read more about how this project came about on my blog:  
- [Introducing Bubo RSS: An Absurdly Minimalist RSS Feed Reader](https://george.mand.is/2019/11/introducing-bubo-rss-an-absurdly-minimalist-rss-feed-reader/).


## Getting Started

- Clone or fork the repo and run  `npm install` to install the dependencies.
- Update `feeds.json` to include categories and links to feeds you would like to see.
- Run `npm run build:bubo`

That's it! You should now have a static page with links to the latest content from your feeds in the `public` folder, ready to serve.

## Differences in Bubo 2.0

Version 2.0 has introduced some substantial changes for Bubo! While the static output remains endearingly spartan, the engine that builds it has changed a bit.

Hopefully all of these changes are in services of making this project more useful to others and encouraging outside contributions.

Changes of note:

- Bubo has been rewritten in [TypeScript](https://www.typescriptlang.org/). It's pretty slick! I anticipate the typing could be improved, but it's a start.
- You fill find an `.nvmrc` file in the root of this project. Learn more [about nvm](https://github.com/nvm-sh/nvm) if you're unfamiliar.
- The script will actually write your `index.html` file for you (Previously the build script simply ran `node src/index.js > output/index.html`). It makes a strong assumption that this file lives in the `public` folder.
- There is a somewhat sophisticated mechansim in-place for batching & throttling your requests, if needed.
## Anatomy of Bubo Reader

The static pieces:

- `conf/feeds.json` - a JSON file containing your feed URLS separated into categories.
- `config/template.html` - a [Nunjucks](https://mozilla.github.io/nunjucks/) template that lets you change how the feeds are displayed. This can be changed to anything else you like— see below.
- `public/style.css` - a CSS file to stylize your feed output.
- `public/index.html` - The HTML file that gets automatically generated when Bubo is run.

The engine:

- `src/index.ts` - The primary script you run when you want to build a new version of Bubo. It will automatically fetch the latest content from your feeds and build a new static file at `public/index.html`.
- `src/renderer.ts` — The renderer that loads Nunjucks, the template and understands how to process the incoming feed data. Prefer something else? This is the place to change it!
- `src/utilities.ts` — A variety of parsing and normalization utilities for Bubo, hidden away to try and keep things clean.

## Throttling

In the main `index.ts` file you will find two values that allow yout to batch and throttle your feed requests:

- `MAX_CONNECTIONS` dictates the maximium number of requests a batch can have going at once.
- `DELAY_MS` dictates the amount of de;ay time between each batch.

The default configuration is **no batching or throttling** beacuse `MAX_CONNECTIONS` is set to `Infinity`. If you wanted to change Bubo to only fetch one feed at a time every second you could set these values to:

```javascript
const MAX_CONNECTIONS = 1;
const DELAY_MS = 1000;
```

If you wanted to limit things to 10 simultaneous requests every 2.5 seconds you could set it like so:

```javascript
const MAX_CONNECTIONS = 10;
const DELAY_MS = 2500;
```

In practice, I've never _really_ run into an issue leaving `MAX_CONNECTIONS` set to `Infinity` but this feels like a sensible safeguard to design.
## Demos

You can view live demos here:

- [https://bubo-rss-demo.netlify.com/](https://bubo-rss-demo.netlify.com/)
- [http://bubo-rss.glitch.me/](http://bubo-rss.glitch.me/)

Not the most exciting-looking demos, I'll admit, but they work!

**Getting Started**

- [Deploying to Glitch](#glitch)
- [Deploying to Netlify](#netlify)
- [Keeping feeds updated](#updated)

<a id="glitch"></a>
## Deploying to Glitch

The quickest way is to remix the project on Glitch:
[https://glitch.com/edit/#!/bubo-rss](https://glitch.com/edit/#!/bubo-rss)

There is also a `glitch` branch on this repo if you'd prefer to start there.

Just change some feeds in `./config/feeds.json` file and you're set! If you'd like to modify the style or the template you can changed `./public/style.css` file or the `./config/template.html` file respectively.

<a id="netlify"></a>
## Deploying to Netlify

- [Fork the repository](https://github.com/georgemandis/bubo-rss/fork)
- From your forked repository edit `config/feeds.json` to manage your feeds and categories
- [Create a new site](https://app.netlify.com/start) on Netlify from GitHub

The deploy settings should automatically import from the `netlify.toml` file. All you'll need to do is confirm and you're ready to go!

<a id="updated"></a>
### Keeping Feeds Updated

#### Using Netlify Webhooks

To keep your feeds up to date you'll want to [setup a Build Hook](https://www.netlify.com/docs/webhooks/#incoming-webhooks) for your Netlify site and use another service to ping it every so often to trigger a rebuild. I'd suggest looking into:

- [IFTTT](https://ifttt.com/)
- [Zapier](https://zapier.com/)
- [EasyCron](https://www.easycron.com/)

#### Using GitHub Actions

Coming soon—there is an old branch that demonstrates this, but it needs to be revisisted in light of Bubo 2.0.

#### Rolling Your Own

If you already have a server running Linux and some command-line experience it might be simpler to setup a [cron job](https://en.wikipedia.org/wiki/Cron).

## Support

If you found this useful please consider sponsoring me or this project. 

If you'd rather run this on your own server please consider using one of these affiliate links to setup a micro instance on [Linode](https://www.linode.com/?r=8729957ab02b50a695dcea12a5ca55570979d8b9), [Digital Ocean](https://m.do.co/c/31f58d367777) or [Vultr](https://www.vultr.com/?ref=8403978).

## Showcase

Here are some websites using Bubo Reader:
- [Kevin Fiol](https://kevinfiol.com/reader/) ([repo](https://github.com/kevinfiol/reader))
