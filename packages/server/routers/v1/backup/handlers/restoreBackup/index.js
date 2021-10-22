const { ResponseError } = require("@bebomining/server/errors");
const path = require("path");
const AdmZip = require("adm-zip");
const Joi = require("joi");

const { app } = require("electron");
const userDataPath = app.getPath("userData");

const basePath = process.env.PORTABLE_EXECUTABLE_DIR
  ? `${userDataPath}/data`
  : "./data";

exports.restoreBackup = async function restoreBackup(req, res, next) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      const error = new Error("No files were uploaded.");
      error.statusCode = 500;
      throw error;
    }

    const { backup } = req.files;

    const zip = new AdmZip(backup.data);

    const uploadPath = path.resolve(basePath);

    const fileNames = zip.getEntries().map(({ entryName }) => entryName);

    Joi.assert(fileNames, validateBackupFiles);

    zip.extractAllTo(uploadPath, true);

    req.locals = {
      response: { statusCode: 201, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};

const validateBackupFiles = Joi.array().items(
  Joi.string().valid("settings.json", "sqlite.db").required()
);
