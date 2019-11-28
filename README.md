# 🦉 Bubo Reader

Bubo is a somewhat irrationally minimalist <acronym title="Really Simple Syndication">RSS</acronym> feed reader you can deploy on Netlify in a few simple steps. It is named after this [silly robot owl](https://www.youtube.com/watch?v=MYSeCfo9-NI) from Clash of the Titans (1981).

I created this one weekend after nostalgically lamenting the [demise of Google Reader](https://killedbygoogle.com/) many years ago. Many RSS feed reader services have sprouted up since then but they all do more than I need. I wanted something that: 

- Had an absurdly simple interface that relied almost entirely on default HTML element behaviors and functionality
- Could be themed with CSS or mildly extended using JavaScript, if I wanted (but I decided not to)
- Didn't worry about pulling in the feed content into the reader's interface. I'm happy to read most content on the site it originated from. I just wanted a single dashboard to see when new stuff is published and available.
- Didn't rely on a database to see what I've read or keep an archive of content over time.

## What does "irrationally minimalist" mean?

Many RSS readers—including the former Google Reader—would pull the contents of a post into your feed so you could read everything in one place. Although I completely understand why someone would want to do that, I decided even that introduced too much complexity for my liking.

My goal with Bubo was to be able to see a list of the most recent posts from websites I like in one place with links to read them if I want. That's it. If I want to read something, I'll click through and read it on the publisher's site. If I want to keep track of what I've clicked on and read I can reflect that using the `a:visited` pseudo selector in my CSS.

Bubo does not store posts in a database or keep track of what I've read. If an item is no longer available in the site's feed then it no longer appears in Bubo. If I miss something, that's just life. I can live with that.

## What about authentication?

There is no authenticaton required for Bubo. Netlify does offer Basic Authentication under their [Pro plan](https://www.netlify.com/pricing/), which would be an easy solution to implement. You could probably also utilize their [Identity](https://www.netlify.com/docs/identity/?_ga=2.147267447.1334380953.1567004741-1681444902.1549770801) feature to add some authentication. I don't subscribe to any private or sensitive feeds, so at the moment that isn't much of a priority for this project.

## Anatomy of Bubo Reader

- `src/index.html` - a [Nunjucks](https://mozilla.github.io/nunjucks/) template that lets you change how the feeds are displayed
- `output/style.css` - a CSS file to stylize your feed output
- `src/feeds.json` - a JSON file containing the URLs for various site's feeds separated into categories
- `src/index.js` - the script that loads the feeds and does the actual parsinga and rendering

## Adding Feeds

Find them in the site's source code and add them to the `feeds.json` file. This is the trickiest part of this whole setup I suppose.

The first version of this project used [Puppeteer](https://github.com/puppeteer/puppeteer) to extract the feeds from a site. This was actually quite cool, but would hang or fail periodicially. I was running this on its own server. It's on my list to look into converting this into a serverless version that could run using Netlify's Functions, but after using my own project for a month I realized it didn't make the thing feel much more usable to me. Builds were slow and there was a lot of work making sure things didn't timeout or use too much memory on the server. Simply parsing a list of known RSS feeds was much simpler and faster.

## Updating

The beauty of running Bubo on Netlify is you can [setup a Build Hook](https://www.netlify.com/docs/webhooks/#incoming-webhooks) to rebuild the site when you want to "refresh" the list of feeds. I'm using [IFTTT](https://ifttt.com) to trigger rebuilds once an hour, which is a perfectly sane rate to consume information at. You could do the same, or use another service like Zapier, EasyCron, setup a cronjob on your server or even setup a cronjob to run locally on your machine and ping the hook as often as you wish.

## How to use

- Clone this repository
- Find RSS feeds and add them to `src/feeds.json`
- Go to Netlify and deploy site from GitHub.
- That's it!

## Sponsor

If you found this useful please consider sponsoring me or this project. If you'd rather run this on your own server please consider using one of these affiliates links to setup a $5 instance on [Linode](https://www.linode.com/?r=8729957ab02b50a695dcea12a5ca55570979d8b9) or [Digital Ocean](https://m.do.co/c/31f58d367777).
 
