/*
* Return our renderer.
* Using Nunjucks out of the box.
* https://mozilla.github.io/nunjucks/
*/

import nunjucks from "nunjucks";
const env: nunjucks.Environment = nunjucks.configure({ autoescape: true });
import { readFile } from "fs/promises";
import { ContentFromAllFeeds } from "./@types/bubo";

/**
 * Global filters for my Nunjucks templates
 */
env.addFilter("formatDate", function (dateString): string {
  const formattedDate: string = new Date(parseInt(dateString)).toLocaleDateString();
  return formattedDate !== "Invalid Date" ? formattedDate : dateString;
});

env.addGlobal("now", (new Date()).toUTCString());

// load the template
const template: string =
  (await readFile(
    new URL("../config/template.html", import.meta.url)
  )).toString();

// generate the static HTML output from our template renderer
const render = ({ data, errors }: { data: ContentFromAllFeeds; errors: unknown[] }) => {
  return env.renderString(template, {
    data,
    errors
  });
};


export { render };
