const fetch = require("node-fetch");
const Joi = require("joi");
const platform = require("os").platform();
const { cache } = require("@bebomining/server/cache");
const duration = 4.68e8;

exports.assets = config => ({
  async assets(args) {
    try {
      Joi.assert(args, argsValidation);

      const { assetId, releaseId, minerName } = args;

      /* Check if platform exist */
      const platformTarget = config.private.os[platform];
      if (typeof platformTarget === "undefined") {
        const error = new Error(`OS: ${platform} is not supported yet!`);
        error.minerName = minerName;
        error.statusCode = 404;
        throw error;
      }

      const { releases } = platformTarget;

      const targetRelease = releases.filter(
        ({ releaseId: target }) => releaseId === target
      )[0];

      if (typeof targetRelease === "undefined") {
        const error = new Error(
          `Release id ${releaseId}: ${platform} is not supported yet!`
        );
        error.minerName = minerName;
        error.statusCode = 404;
        throw error;
      }

      const { apiURL } = targetRelease;
      let results = cache.get(apiURL);

      if (results === null) {
        const resAPI = await fetch(apiURL);
        results = await resAPI.json();
        cache.put(apiURL, results, duration);
      }

      const { assets } = results;
      const asset = assets.find(({ id }) => assetId == id);

      if (typeof asset === "undefined") {
        const error = new Error(
          `Asset id ${assetId}: ${releaseId}-${platform} is not supported yet!`
        );
        error.minerName = minerName;
        error.statusCode = 404;
        throw error;
      }

      return asset;
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  }
});

const argsValidation = Joi.object({
  assetId: Joi.number().required(),
  releaseId: Joi.number().required(),
  minerName: Joi.string().required()
});
