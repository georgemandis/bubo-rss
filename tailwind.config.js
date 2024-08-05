const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./config/*.html"],
	theme: {
		extend: {
			fontFamily: {
				// from https://github.com/system-fonts/modern-font-stacks
				/* System UI fonts are those native to the operating system interface.
				 * They are highly legible and easy to read at small sizes, contains
				 * many font weights, and is ideal for UI elements.
				 */
				system: ["system-ui", "sans-serif"],
				/* Transitional typefaces are a mix between Old Style and Modern
				 * typefaces that was developed during The Enlightenment. One of the
				 * most famous examples of a Transitional typeface is Times New Roman,
				 * which was developed for the Times of London newspaper.
				 */
				transitional: [
					"Charter",
					"'Bitstream Charter'",
					"'Sitka Text'",
					"Cambria",
					"serif",
				],
				/* Old Style typefaces are characterized by diagonal stress, low
				 * contrast between thick and thin strokes, and rounded serifs, and
				 * were developed in the Renaissance period. One of the most famous
				 * examples of an Old Style typeface is Garamond.
				 */
				"old-style": [
					"'Iowan Old Style'",
					"'Palatino Linotype'",
					"'URW Palladio L'",
					"P052",
					"serif",
				],
				/* Humanist typefaces are characterized by their organic, calligraphic
				 * forms and low contrast between thick and thin strokes. These
				 * typefaces are inspired by the handwriting of the Renaissance period
				 * and are often considered to be more legible and easier to read than
				 * other sans-serif typefaces.
				 */
				humanist: [
					"Seravek",
					"'Gill Sans Nova'",
					"Ubuntu",
					"Calibri",
					"'DejaVu Sans'",
					"source-sans-pro",
					"sans-serif",
				],
				/* Geometric Humanist typefaces are characterized by their clean,
				 * geometric forms and uniform stroke widths. These typefaces are often
				 * considered to be modern and sleek in appearance, and are often used
				 * for headlines and other display purposes. Futura is a famous example
				 * of this classification.
				 */
				"gemoetric-humanist": [
					"Avenir",
					"Montserrat",
					"Corbel",
					"'URW Gothic'",
					"source-sans-pro",
					"sans-serif",
				],
				/* Classical Humanist typefaces are characterized by how the strokes
				 * subtly widen as they reach the stroke terminals without ending in a
				 * serif. These typefaces are inspired by classical Roman capitals and
				 * the stone-carving on Renaissance-period tombstones.
				 */
				"classical-humanist": [
					"Optima",
					"Candara",
					"'Noto Sans'",
					"source-sans-pro",
					"sans-serif",
				],
				/* Neo-Grotesque typefaces are a style of sans-serif that was developed
				 * in the late 19th and early 20th centuries and is characterized by its
				 * clean, geometric forms and uniform stroke widths. One of the most
				 * famous examples of a Neo-Grotesque typeface is Helvetica.
				 */
				"neo-grotesque": [
					"Inter",
					"Roboto",
					"'Helvetica Neue'",
					"'Arial Nova'",
					"'Nimbus Sans'",
					"Arial",
					"sans-serif",
				],
				/* Monospace Slab Serif typefaces are characterized by their fixed-width
				 * letters, which have the same width regardless of their shape, and its
				 * simple, geometric forms. Used to emulate typewriter output for
				 * reports, tabular work and technical documentation.
				 */
				"monospace-slab-serif": [
					"'Nimbus Mono PS'",
					"'Courier New'",
					"monospace",
				],
				/* Monospace Code typefaces are specifically designed for use in
				 * programming and other technical applications. These typefaces are
				 * characterized by their monospaced design, which means that all
				 * letters and characters have the same width, and their clear, legible
				 * forms.
				 */
				"monospace-code": [
					"ui-monospace",
					"'Cascadia Code'",
					"'Source Code Pro'",
					"Menlo",
					"Consolas",
					"'DejaVu Sans Mono'",
					"monospace",
				],
				/* Industrial typefaces originated in the late 19th century and was
				 * heavily influenced by the advancements in technology and industry
				 * during that time. Industrial typefaces are characterized by their
				 * bold, sans-serif letterforms, simple and straightforward appearance,
				 * and the use of straight lines and geometric shapes.
				 */
				industrial: [
					"Bahnschrift",
					"'DIN Alternate'",
					"'Franklin Gothic Medium'",
					"'Nimbus Sans Narrow'",
					"sans-serif-condensed",
					"sans-serif",
				],
				/* Rounded typefaces are characterized by the rounded curved letterforms
				 * and give a softer, friendlier  appearance. The rounded edges give the
				 * typeface a more organic and
				 * playful feel, making it suitable for use in informal or child-friendly
				 * designs. The rounded sans-serif style has been popular since the 1950s,
				 * and it continues to be widely used in advertising, branding, and
				 * other forms of graphic design.
				 */
				"rounded-sans": [
					"ui-rounded",
					"'Hiragino Maru Gothic ProN'",
					"Quicksand",
					"Comfortaa",
					"Manjari",
					"'Arial Rounded MT'",
					"'Arial Rounded MT Bold'",
					"Calibri",
					"source-sans-pro",
					"sans-serif",
				],
				/* Slab Serif typefaces are characterized by the presence of thick,
				 * block-like serifs on the ends of each letterform. These serifs are
				 * usually unbracketed, meaning they do not have any curved or tapered
				 * transitions to the main stroke of the letter.
				 */
				"slab-serif": [
					"Rockwell",
					"'Rockwell Nova'",
					"'Roboto Slab'",
					"'DejaVu Serif'",
					"'Sitka Small'",
					"serif",
				],
				/* Antique typefaces, also known as Egyptians, are a subset of serif
				 * typefaces that were popular in the 19th century. They are
				 * characterized by their block-like serifs and thick uniform stroke
				 * weight.
				 */
				antique: [
					"Superclarendon",
					"'Bookman Old Style'",
					"'URW Bookman'",
					"'URW Bookman L'",
					"'Georgia Pro'",
					"Georgia",
					"serif",
				],
				/* Didone typefaces, also known as Modern typefaces, are characterized
				 * by the high contrast between thick and thin strokes, vertical stress,
				 * and hairline serifs with no bracketing. The Didone style emerged in
				 * the late 18th century and gained popularity during the 19th century.
				 */
				didone: [
					"Didot",
					"'Bodoni MT'",
					"'Noto Serif Display'",
					"'URW Palladio L'",
					"P052",
					"Sylfaen",
					"serif",
				],
				/* Handwritten typefaces are designed to mimic the look and feel of
				 * handwriting. Despite the vast array of handwriting styles, this font
				 * stack tend to adopt a more informal and everyday style of handwriting.
				 */
				handwritten: [
					"'Segoe Print'",
					"'Bradley Hand'",
					"Chilanka",
					"TSCu_Comic",
					"casual",
					"cursive",
				],
				emoji: [
					"'Apple Color Emoji'",
					"'Segoe UI Emoji'",
					"'Segoe UI Symbol'",
					"'Noto Color Emoji'",
				],
			},
		},
	},
	plugins: [
		plugin(({ addBase }) => {
			addBase({
				a: {
					textDecoration: "underline",
					transition: "color 0.2s",
					cursor: "pointer",
				},
			});
		}),
	],
};
