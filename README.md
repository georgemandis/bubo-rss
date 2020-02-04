# 🦉 Bubo Reader

Bubo Reader is a somewhat irrationally minimalist <acronym title="Really Simple Syndication">RSS</acronym> and <acronym title="JavaScript Object Notation">JSON</acronym> feed reader you can deploy on [Netlify](https://netlify.com) in a few steps or [Glitch](https://glitch.com) in even fewer steps! The goal of the project is to generate a webpage that shows a list of links from a collection of feeds organized by category and website. That's it.

It is named after this [silly robot owl](https://www.youtube.com/watch?v=MYSeCfo9-NI) from Clash of the Titans (1981).

You can read more about how this project came about in my blog post '[Introducing Bubo RSS: An Absurdly Minimalist RSS Feed Reader](https://george.mand.is/2019/11/introducing-bubo-rss-an-absurdly-minimalist-rss-feed-reader/)'

## Getting Started

How to deploy Bubo Reader in a few easy steps with Netlify or Glitch:

### Deploying to Glitch

The quickest way is to remix the project on Glitch:
[https://glitch.com/edit/#!/bubo-rss](https://glitch.com/edit/#!/bubo-rss)

Just changed some feeds in `./src/feeds.json` file and you're set! If you'd like to modify the style or the template you can changed `./output/style.css` file or the `./src/template.html` file respectively.

There is also a special `glitch` branch you can clone if you prefer:
[https://github.com/georgemandis/bubo-rss/tree/glitch](https://github.com/georgemandis/bubo-rss/tree/glitch)

The only difference between this branch and `master` is that it spins up a server using [Express](https://expressjs.com/) to serve your `./output/index.html` file on Glitch. Everything else is the same.

### Deploying to Netlify

- [Fork the repository](https://github.com/georgemandis/bubo-rss/fork)
- From your forked repository go to and edcit `src/feeds.json` to manage your feeds and categories
- [Create a new site](https://app.netlify.com/start) on Netlify from GitHub 

The deploy settings should automatically import from the `netlify.toml` file. All you'll need to do is confirm and you're ready to go!

### Keeping Feeds Updated

#### Using Netlify Webhooks

To keep your feeds up to date you'll want to [setup a Build Hook](https://www.netlify.com/docs/webhooks/#incoming-webhooks) for your Netlify site and use another service to ping it every so often to trigger a rebuild. I'd suggest looking into:

- [IFTTT](https://ifttt.com/)
- [Zapier](https://zapier.com/)
- [EasyCron](https://www.easycron.com/)

If you already have a server running Linux and some command-line experience it might be simpler to setup a [cron job](https://en.wikipedia.org/wiki/Cron). 

#### Using GitHub Actions

This approach is a little different and requires some modifications to the repository. Netlify started billing for [build minutes](https://www.netlify.com/pricing/faq/) very shortly after I published this project. Running `npm build` and downloading all of the RSS feeds took up a substantial number of this minutes, particulary if you had some kind of process pinging the webhook and trigger a build every 15 minutes or so.

How is the The GitHub Action-based approach different? The same build process runs, but this time it's on GitHub's servers via the Action. It then **commits** the newly created file generated at `./output/index.html` back into the repository. Netlify still gets pinged when the repository is updated, but skips the `npm run build` step on their end, which significantly reduces the number of build minutes required.

**Short Answer**: use the [`github-action-publishing`](https://github.com/georgemandis/bubo-rss/tree/github-action-publishing) branch for now if you'd prefer to use GitHub Actions to run your builds. 

The GitHub Action is setup to build and commit directly to the `master` branch, which is not the best practice. I'd suggest creating a separate branch to checkout and commit changes to in the Action. You could then specify that same branch as the one to checkout and publish on Netlify.

## Anatomy of Bubo Reader

- `src/index.html` - a [Nunjucks](https://mozilla.github.io/nunjucks/) template that lets you change how the feeds are displayed
- `output/style.css` - a CSS file to stylize your feed output
- `src/feeds.json` - a JSON file containing the URLs for various site's feeds separated into categories
- `src/index.js` - the script that loads the feeds and does the actual parsinga and rendering

## Demos

You can view live demos here:

- [https://bubo-rss-demo.netlify.com/](https://bubo-rss-demo.netlify.com/)
- [http://bubo-rss.glitch.me/](http://bubo-rss.glitch.me/)

Not the most exciting-looking demos, I'll admit, but they work!

## Support

If you found this useful please consider sponsoring me or this project. If you'd rather run this on your own server please consider using one of these affiliate links to setup a micro instance on [Linode](https://www.linode.com/?r=8729957ab02b50a695dcea12a5ca55570979d8b9), [Digital Ocean](https://m.do.co/c/31f58d367777) or [Vultr](https://www.vultr.com/?ref=8403978).