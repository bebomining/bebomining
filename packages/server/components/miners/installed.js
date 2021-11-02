const path = require("path");
const fetch = require("node-fetch");
const { readdirSync } = require("fs");
const { cache } = require("@bebomining/server/cache");
const platform = require("os").platform();

const { app } = require("electron");
const userDataPath = app.getPath("userData");

const distFolder = process.env.PORTABLE_EXECUTABLE_DIR
  ? `${userDataPath}/miners`
  : "./miners";

const duration = 4.68e8;

const installed = config => ({
  async installed() {
    const minerMode = config.minerMode;
    const minerName = config.name;
    const algoSupported = config.algoSupported;
    const supportGPUsRegex = config.supportGPUsRegex;
    const targetPath = path.resolve(`${distFolder}/${minerName}`);

    let list;
    try {
      list = getDirectories(targetPath);
    } catch {
      return null;
    }

    try {
      const { releases } = config.private.os[platform];
      const mapApiURL = releases.filter(({ assetId: targetAssedId }) =>
        list.includes(String(targetAssedId))
      );

      const promises = mapApiURL.map(async ({ apiURL, assetId, releaseId }) => {
        const cacheContent = cache.get(apiURL);
        if (cacheContent) {
          const { tag_name: tagName } = cacheContent;
          const results = {
            minerName,
            minerMode,
            tagName,
            assetId,
            releaseId,
            supportGPUsRegex,
            algoSupported
          };
          return results;
        } else {
          const resAPI = await fetch(apiURL);
          const json = await resAPI.json();
          cache.put(apiURL, json, duration);
          const { tag_name: tagName } = json;
          const results = {
            minerName,
            minerMode,
            tagName,
            assetId,
            releaseId,
            algoSupported
          };
          return results;
        }
      });

      return await Promise.all(promises);
    } catch {
      const error = new Error(`${minerName} - Not Installed!`);
      error.statusCode = 404;
      error.minerName = minerName;
      throw error;
    }
  }
});

exports.installed = installed;

function getDirectories(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}
