import tailwindIntegration from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "static",
	integrations: [tailwindIntegration()],
});
