const Joi = require("joi");
const { ResponseError } = require("@bebomining/server/errors");
const miners = require("@bebomining/server/miners");
const { download, unzip } = require("./utils");

const bodyValidator = Joi.object({
  assetId: Joi.number().required(),
  releaseId: Joi.number().required(),
  minerName: Joi.string().required()
});

exports.createMiner = async function createMiner(req, res, next) {
  try {
    /* Validate body req */
    const { error } = bodyValidator.validate(req.body);
    if (typeof error !== "undefined") {
      error.statusCode = 400;
      throw error;
    }

    const { assetId, releaseId, minerName } = req.body;

    /* Check if miner exist */
    const currentMiner = miners[minerName];
    if (typeof currentMiner === "undefined") {
      const error = new Error(`Miner: '${minerName}' - Not Found!`);
      error.statusCode = 404;
      throw error;
    }

    const asset = await currentMiner.assets({ assetId, releaseId, minerName });

    /* download the miner from repos */
    const tmpPath = await download({
      link: asset.browser_download_url,
      fileName: asset.name
    });

    /* unzip the miner from tmp */
    await unzip({ destFolder: minerName, filePath: tmpPath, assetId });

    req.locals = {
      response: { minerName, statusCode: 201, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
