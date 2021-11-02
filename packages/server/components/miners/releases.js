const fetch = require("node-fetch");
const { cache } = require("@bebomining/server/cache");
const platform = require("os").platform();

const duration = 4.68e8;

const releases = config => ({
  async releases() {
    /* Check if platform exist */
    const platformTarget = config.private.os[platform];
    if (typeof platformTarget === "undefined") {
      const error = new Error(`OS: ${platform} is not supported yet!`);
      error.statusCode = 404;
      throw error;
    }

    const { releases } = platformTarget;
    const promises = releases.map(async ({ apiURL, assetId }) => {
      const cacheContent = cache.get(apiURL);
      if (cacheContent) {
        const assets = cacheContent.assets.find(({ id }) => assetId === id);
        const results = { ...cacheContent, assets };
        return results;
      } else {
        const resAPI = await fetch(apiURL);
        const json = await resAPI.json();
        cache.put(apiURL, json, duration);

        const assets = json.assets.find(({ id }) => assetId === id);
        const results = { ...json, assets };
        return results;
      }
    });

    try {
      const results = await Promise.all(promises);
      return results;
    } catch (err) {
      err.statusCode = 500;
      throw error;
    }
  }
});

exports.releases = releases;
