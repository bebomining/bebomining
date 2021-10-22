const { cache } = require("@bebomining/server/cache");
const fetch = require("@bebomining/server/fetch");

const duration = 4.68e8;

exports.algos = config => ({
  async algos({ minerMode } = {}) {
    try {
      const { apiBaseURL } = config.private;
      const algosURL = `${apiBaseURL}/api/v1/algos/${config.name}.json`;

      let results = cache.get(algosURL);

      if (results === null) {
        const resAPI = await fetch(algosURL);
        results = await resAPI.json();
        cache.put(algosURL, results, duration);
      }

      const algoSupported = minerMode ? results[minerMode] : results;
      if (typeof algoSupported === "undefined") {
        const error = new Error(
          `Pool: ${config.name} does not support any algo for: ${minerMode} mining`
        );
        error.statusCode = 404;
        throw error;
      }

      return algoSupported;
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  }
});
