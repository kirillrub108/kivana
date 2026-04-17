import { HtmlBasePlugin } from "@11ty/eleventy";

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  
  // Возвращаем фильтр head, который используется в index.njk
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array)) return array;
    return array.slice(0, n);
  });
  
  return {
    dir: { input: "src", output: "_site" },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk"
  };
};
