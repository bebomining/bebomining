const fs = require("fs");
const path = require("path");
const { readdirSync } = require("fs");

const platform = require("os").platform();
const os = require("@bebomining/server/os");
const pools = require("@bebomining/server/pools");

const { app } = require("electron");
const userDataPath = app.getPath("userData");

const distFolder = process.env.PORTABLE_EXECUTABLE_DIR
  ? `${userDataPath}/miners`
  : "./miners";

const startFromWorker = config => ({
  async startFromWorker(worker) {
    /* Check if miner is supported by the OS */
    const executableName = config.private.os[platform].exe;
    if (typeof executableName === "undefined") {
      const error = new Error(`OS platform: '${platform}' - Not Found!`);
      error.statusCode = 404;
      throw error;
    }

    const { minerName, minerAssetId: assetId } = worker;

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

    const exePath = dest
      ? path.resolve(`${assetFolder}/${dest}/${executableName}`)
      : path.resolve(`${assetFolder}/${executableName}`);

    /* Check if miner executable exist */
    if (!fs.existsSync(exePath)) {
      const error = new Error(
        `'${minerName}' version '${assetId}'- Not Found!`
      );
      error.statusCode = 404;
      throw error;
    }

    /* Check if runner exist */
    const runner = os[platform];
    if (typeof runner === "undefined") {
      const error = new Error(`OS: ${platform} is not supported yet!`);
      error.statusCode = 404;
      throw error;
    }

    let isPortBusy;
    do {
      worker.portStat = this.statsPort().port;
      isPortBusy = await runner.checkPortStatus(worker.portStat);
    } while (isPortBusy);

    const { poolName } = worker;
    const { userAndPoolConfig } =
      pools?.[poolName]?.config?.private?.miners?.[config.name];

    if (typeof userAndPoolConfig === "undefined") {
      const error = new Error(`Pool: ${poolName} is not supported yet!`);
      error.statusCode = 404;
      throw error;
    }

    const usersAndPools = buildUserAndPoolConfig(
      { worker, userAndPoolConfig },
      this
    );

    const args = buildArgs({ worker, config, usersAndPools }, this);
    console.log("args => ", args);
    console.log("exePath => ", exePath);
    const pid = await runner.startProcess({ exePath, args, worker });
    return { pid, portStat: worker.portStat };
  }
});

exports.startFromWorker = startFromWorker;

function getDirectories(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)[0];
}

function buildUserAndPoolConfig({ worker, userAndPoolConfig }, miner) {
  const regions = worker.poolRegion.split(",");
  const { mapCmdKey = {} } = miner.config.private;

  return regions
    .map(poolRegion => {
      const startCMD = userAndPoolConfig;
      const argsList = startCMD.split(",");
      const keyToReplace = { ...worker, poolRegion, ...mapCmdKey };
      return replaceArgs({ argsList, worker: keyToReplace, miner });
    })
    .flat()
    .join(",");
}

function buildArgs({ worker, config, usersAndPools }, miner) {
  const startCMD = config.private.start.replace(
    "${usersAndPools}",
    usersAndPools
  );

  const argsList = startCMD.split(",");
  return replaceArgs({ argsList, worker, miner });
}

function replaceArgs({ argsList, miner, worker }) {
  const workerKey = Object.keys(worker);

  return argsList
    .map(cmd => {
      if (/\$\{(.*?)\}/g.test(cmd)) {
        let cmdAdded = cmd;
        workerKey.forEach(keyToReplace => {
          let replaceWith = worker[keyToReplace];
          console.log(keyToReplace);
          if (miner.parser[keyToReplace]) {
            replaceWith = miner.parser[keyToReplace](worker[keyToReplace]);
          }
          cmdAdded = cmdAdded.replace(`$\{${keyToReplace}\}`, replaceWith);
        });
        return cmdAdded;
      } else {
        return cmd;
      }
    })
    .map(val => val.trim());
}
