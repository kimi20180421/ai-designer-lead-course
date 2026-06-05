import { readFileSync, writeFileSync } from "node:fs";

const htmlPath = new URL("./index.html", import.meta.url);
const slidesPath = new URL("./slides.html", import.meta.url);
const html = readFileSync(htmlPath, "utf8");
const slides = readFileSync(slidesPath, "utf8").trim();
const start = html.indexOf('\n<section class="slide') + 1;
const end = html.indexOf("\n</div>\n\n<div id=\"nav\"></div>", start);

if (start < 0 || end < 0) {
  throw new Error("Could not locate slide insertion range");
}

const output = html.slice(0, start) + slides + "\n" + html.slice(end);
writeFileSync(htmlPath, output);
