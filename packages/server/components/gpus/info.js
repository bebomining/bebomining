const platform = require("os").platform();
const os = require("@bebomining/server/os");

exports.info = () => ({
  async info(filters = {}) {
    try {
      /* Check if platform exist */
      const runner = os[platform];
      if (typeof runner === "undefined") {
        const error = new Error(`OS: ${platform} is not supported yet!`);
        error.statusCode = 404;
        throw error;
      }

      const { processor } = filters;
      const info = await runner.gpusinfo();

      const regex = new RegExp(processor, "gi"); // constructor with string pattern as first argument

      return info
        .filter(({ videoProcessor, name }) => {
          return (
            typeof processor === "undefined" ||
            (typeof processor === "string" &&
              processor.trim().length > 0 &&
              (videoProcessor.match(regex) !== null ||
                name.match(regex) !== null))
          );
        })
        .map((gpu, id) => ({ ...gpu, id }));
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  }
});
