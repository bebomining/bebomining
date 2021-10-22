const express = require("express");

const { handleCreateBackup, handleRestoreBackup } = require("./backup");

const {
  handleMinerCreation,
  handleReleasesList,
  handleMinersList,
  handleMinersStart,
  handleRunningMiners,
  handleInstalledMiner,
  handleAllInstalledMiner,
  handleMinersStop
} = require("./miners");

const {
  handleWorkerCreation,
  handleWorkerList,
  handleWorkerDeletion,
  handleWorkerById,
  handleWorkerStart,
  handleWorkerEditing,
  handleWorkerStop,
  handleWorkerStats,
  handleWorkerLogs
} = require("./workers");

const {
  handleWalletCreation,
  handleGetWallets,
  handleWalletDeletion
} = require("./wallets");

const {
  handleAddCoin,
  handleGetCoins,
  handleDeleteCoin,
  handleSupportedCoins
} = require("./coins");

const { handleGetDonationCoins } = require("./donations");

const { handleInfoGPU } = require("./gpus");

const {
  handleFetchAllAlgos,
  handleFetchAlgos,
  handleFetchRegions,
  handleFetchCoins,
  handleFetchAllPools,
  handlePoolStats
} = require("./pools");

const {
  handleEnablingCloud,
  handleDisablingCloud,
  handleGettingCloud,
  handleRefreshRigID,
  handleGetUserSettings
} = require("./settings");

const routerV1 = express.Router();

/* ---- backup routes ---- */
routerV1.get("/data/_backup", handleCreateBackup); // make data backup
routerV1.post("/data/_backup", handleRestoreBackup); // restore data backup
/* ---- backup routes ---- */

/* ---- minesrs routes ---- */
routerV1.post("/miners", handleMinerCreation); // create miner
routerV1.post("/miners/:minerName/_start", handleMinersStart); // start miner
routerV1.post("/miners/:minerName/_stop", handleMinersStop); // stop miner
routerV1.get("/miners/_installed", handleAllInstalledMiner); // get all installed miner
routerV1.get("/miners/:minerName", handleRunningMiners); // get running miners
routerV1.get("/miners", handleMinersList); // list supported miners
routerV1.get("/miners/:minerName/releases", handleReleasesList); // list releases of a miner
routerV1.get("/miners/:minerName/_installed", handleInstalledMiner); // get installed miner
/* ---- minesrs routes ---- */

/* ---- gpus routes ---- */
routerV1.get("/gpus", handleInfoGPU); // list installed gpus
/* ---- gpus routes ---- */

/* ---- workers routes ---- */
routerV1.post("/workers", handleWorkerCreation); // create worker
routerV1.put("/workers/:id", handleWorkerEditing); // edit an existing worker
routerV1.get("/workers", handleWorkerList); // list all worker
routerV1.post("/workers/:id/_start", handleWorkerStart); // start a worker
routerV1.post("/workers/:id/_stop", handleWorkerStop); // stop a worker
routerV1.get("/workers/:id", handleWorkerById); // list worker by id
routerV1.get("/workers/:id/_stats", handleWorkerStats); // get stats from running worker
routerV1.get("/workers/:id/_logs", handleWorkerLogs); // get logs from running worker
routerV1.delete("/workers/:id", handleWorkerDeletion); // delete worker by id
/* ---- workers routes ---- */

/* ---- wallets routes ---- */
routerV1.post("/wallets", handleWalletCreation); // create a wallet
routerV1.get("/wallets", handleGetWallets); // get wallet
routerV1.delete("/wallets/:id", handleWalletDeletion); // delete wallet by id
/* ---- wallets routes ---- */

/* ---- coins routes ---- */
routerV1.post("/coins", handleAddCoin); // add coin to a wallet
routerV1.get("/coins", handleGetCoins); // get coin by any field
routerV1.get("/coins/_supported", handleSupportedCoins); // list all supported coins
routerV1.delete("/coins/:id", handleDeleteCoin); // delete a coin by id
/* ---- coins routes ---- */

/* ---- pools routes ---- */
routerV1.get("/pools", handleFetchAllPools); // list all supported pools
routerV1.get("/pools/:poolName/coins", handleFetchCoins); // list all supported coins
routerV1.get("/pools/:poolName/regions", handleFetchRegions); // list all supported regions
routerV1.get("/pools/:poolName/algos", handleFetchAllAlgos); // list all supported algorithms
routerV1.get("/pools/:poolName/algos/:minerMode", handleFetchAlgos); // list all supported algorithms by minerMode
routerV1.get("/pools/:poolName/stats/:workerId", handlePoolStats); // get stats from pool
/* ---- pools routes ---- */

/* ---- donations routes ---- */
routerV1.get("/donations", handleGetDonationCoins);
/* ---- donations routes ---- */

/* ---- settings routes ---- */
routerV1.get("/settings", handleGetUserSettings);
routerV1.get("/settings/cloud", handleGettingCloud);
routerV1.put("/settings/cloud/_enable", handleEnablingCloud);
routerV1.put("/settings/cloud/_disable", handleDisablingCloud);
routerV1.put("/settings/cloud/_refresh", handleRefreshRigID);
/* ---- settings routes ---- */

module.exports = { routerV1 };
