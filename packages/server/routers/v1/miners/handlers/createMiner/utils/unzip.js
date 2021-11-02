const AdmZip = require("adm-zip");
const Joi = require("joi");
const path = require("path");

const { app } = require("electron");
const userDataPath = app.getPath("userData");

const distFolder = process.env.PORTABLE_EXECUTABLE_DIR
  ? `${userDataPath}/miners`
  : "./miners";

exports.unzip = async function unzip(args) {
  try {
    Joi.assert(args, argsValidation);

    const { filePath, destFolder, assetId } = args;
    const zip = new AdmZip(filePath);
    zip.extractAllTo(
      path.resolve(`${distFolder}/${destFolder}/${assetId}`),
      /*overwrite*/ true
    );
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    throw error;
  }
};

const argsValidation = Joi.object({
  filePath: Joi.string().required(),
  destFolder: Joi.string().required(),
  assetId: Joi.number().required()
});
