const { HtmlBasePlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // Подключаем плагин для автоматической обработки абсолютных ссылок
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Копируем статику без обработки
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/assets/images/favicon/favicon.ico": "favicon.ico" });

  // Фильтр текущего года
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // Фильтр head — первые N элементов массива
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array)) return array;
    return array.slice(0, n);
  });

  return {
    pathPrefix: process.env.PATH_PREFIX || "/", // По умолчанию корень (для dev и custom домена)
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk"
  };
};
