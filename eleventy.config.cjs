module.exports = function(eleventyConfig) {
  // Копируем статику без обработки
  eleventyConfig.addPassthroughCopy("src/assets");

  // Фильтр текущего года
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // Фильтр head — первые N элементов массива
  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array)) return array;
    return array.slice(0, n);
  });

  return {
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
