/*
 * Return our renderer.
 * Using Nunjucks out of the box.
 * https://mozilla.github.io/nunjucks/
 */

import nunjucks from "nunjucks";
const env: nunjucks.Environment = nunjucks.configure({ autoescape: true });
import { readFile } from "fs/promises";
import { Feeds, JSONValue } from "./@types/bubo";

/**
 * Global filters for my Nunjucks templates
 */
env.addFilter("formatDate", function (dateString): string {
  const date: Date = new Date(parseInt(dateString));
  return !isNaN(date.getTime()) ? date.toLocaleDateString() : dateString;
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
  info
}: {
  data: Feeds;
  errors: unknown[];
  info?: JSONValue;
}) => {
  return env.renderString(template, {
    data,
    errors,
    info
  });
};

export { render };
