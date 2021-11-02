const fs = require("fs");
const path = require("path");
const { readdirSync } = require("fs");
const platform = require("os").platform();
const os = require("@bebomining/server/os");

const { app } = require("electron");
const userDataPath = app.getPath("userData");

const distFolder = process.env.PORTABLE_EXECUTABLE_DIR
  ? `${userDataPath}/miners`
  : "./miners";

const start = config => ({
  async start({ assetId, args }) {
    const { name: minerName } = config;

    /* Check if miner is supported by the OS */
    const executableName = config.private.os[platform].exe;
    if (typeof executableName === "undefined") {
      const error = new Error(`OS platform: '${platform}' - Not Found!`);
      error.statusCode = 404;
      throw error;
    }

    /* Check if args contains reserved parameters */
    const { reservedParameters } = config.private;
    const paramsNotAllowed = args
      .map(val => val.trim())
      .some(r => reservedParameters.includes(r));

    if (paramsNotAllowed) {
      const error = new Error(
        `args contains reserved parameters: '${reservedParameters}'`
      );
      error.statusCode = 400;
      throw error;
    }

    const assetFolder = path.resolve(`${distFolder}/${minerName}/${assetId}`);
    let dest;
    try {
      dest = getDirectories(assetFolder);
    } catch {
      const error = new Error(
        `'${minerName}' with assetId: '${assetId}'- Not Found!`
      );
      error.statusCode = 404;
      throw error;
    }

    const exePath = path.resolve(`${assetFolder}/${dest}/${executableName}`);
    console.log(exePath);

    /* Check if miner executable exist */
    if (!fs.existsSync(exePath)) {
      const error = new Error(
        `'${minerName}' version '${assetId}'- Not Found!`
      );
      error.statusCode = 404;
      throw error;
    }

    /* Check if platform exist */
    const runner = os[platform];
    if (typeof runner === "undefined") {
      const error = new Error(`OS: ${platform} is not supported yet!`);
      error.statusCode = 404;
      throw error;
    }

    const pid = await runner.startProcess({ exePath, args });

    return pid;
  }
});

exports.start = start;

function getDirectories(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)[0];
}
