const { cache } = require("@bebomining/server/cache");
const fetch = require("@bebomining/server/fetch");

const duration = 4.68e8;

exports.coins = config => ({
  async coins() {
    try {
      const { apiBaseURL } = config.private;
      const coinsURL = `${apiBaseURL}/api/v1/coins/${config.name}.json`;

      let results = cache.get(coinsURL);

      if (results === null) {
        const resAPI = await fetch(coinsURL);
        results = await resAPI.json();
        cache.put(coinsURL, results, duration);
      }

      return results;
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  }
});
