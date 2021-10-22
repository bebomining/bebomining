const { cache } = require("@bebomining/server/cache");
const fetch = require("@bebomining/server/fetch");

const duration = 4.68e8;
exports.regions = config => ({
  async regions(algoTarget) {
    try {
      const { apiBaseURL } = config.private;
      const regionsURL = `${apiBaseURL}/api/v1/regions/${config.name}.json`;

      let results = cache.get(regionsURL);

      if (results === null) {
        const resAPI = await fetch(regionsURL);
        results = await resAPI.json();
        cache.put(regionsURL, results, duration);
      }

      const { meta, servers: allServers } = results;

      const servers = allServers.filter(
        ({ algo }) =>
          !algoTarget || algo.toLowerCase() === algoTarget.toLowerCase()
      );

      return { meta, servers };
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  }
});
