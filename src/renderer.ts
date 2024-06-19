/*
 * Return our renderer.
 * Using Nunjucks out of the box.
 * https://mozilla.github.io/nunjucks/
 */

import nunjucks from "nunjucks";
const env: nunjucks.Environment = nunjucks.configure({ autoescape: true });
import { readFile } from "node:fs/promises";
import type { Feeds, JSONValue } from "./@types/bubo";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
const timeFormatter = new TimeAgo("en-US");
/**
 * Global filters for my Nunjucks templates
 */
env.addFilter("relative", (dateString): string => {
	const date: Date = new Date(Number.parseInt(dateString));
	return !Number.isNaN(date.getTime()) ? timeFormatter.format(date) : dateString;
});

env.addFilter("formatTime", (dateString): string => {
	const date: Date = new Date(Number.parseInt(dateString));
	return !Number.isNaN(date.getTime()) ? date.toLocaleTimeString() : dateString;
});

env.addGlobal("now", new Date().toUTCString());

// load the template
const template: string = (
	await readFile(new URL("../config/template.html", import.meta.url))
).toString();

// generate the static HTML output from our template renderer
const render = ({
	data,
	errors,
	info,
}: {
	data: Feeds;
	errors: unknown[];
	info?: JSONValue;
}) => {
	return env.renderString(template, {
		data,
		errors,
		info,
	});
};

export { render };
