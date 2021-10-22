const { ResponseError } = require("@bebomining/server/errors");
const path = require("path");
const AdmZip = require("adm-zip");

const { app } = require("electron");
const userDataPath = app.getPath("userData");

const basePath = process.env.PORTABLE_EXECUTABLE_DIR
  ? `${userDataPath}/data`
  : "./data";

exports.createBackup = async function createBackup(req, res, next) {
  try {
    const zip = new AdmZip();
    const pathDataSource = path.resolve(basePath);
    const now = new Date();
    const name = formatDate(now);
    const pathOut = `backups/${name}_${now.getTime()}.zip`;

    zip.addLocalFolder(pathDataSource);
    zip.writeZip(path.resolve(`./public/${pathOut}`));

    req.locals = {
      response: { path: pathOut, statusCode: 201, status: "success" }
    };
    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
