const stream = require("stream");
const fetch = require("node-fetch");
const util = require("util");
const fs = require("fs");
const streamPipeline = util.promisify(stream.pipeline);
const Joi = require("joi");
const path = require("path");

const tmpDirDownloads = path.resolve("./tmp");
if (!fs.existsSync(tmpDirDownloads)) {
  fs.mkdirSync(tmpDirDownloads);
}

exports.download = async function download(args) {
  try {
    Joi.assert(args, argsValidation);

    const { link, fileName } = args;
    const response = await fetch(link);
    const fileTmpDest = path.resolve(tmpDirDownloads, `${fileName}`);
    await streamPipeline(response.body, fs.createWriteStream(fileTmpDest));

    return fileTmpDest;
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    throw error;
  }
};

const argsValidation = Joi.object({
  link: Joi.string().required(),
  fileName: Joi.string().required()
});
