import tailwindIntegration from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://carterworks.github.io/",
	base: "rss-reader",
	output: "static",
	integrations: [tailwindIntegration()],
});
