const { createPool } = require("./createPool");

const unmineableConfig = require("./configs/unmineable.json");
const { unmineable: unmineablePoolStats } = require("./unmineable");
const unmineable = createPool(unmineableConfig, unmineablePoolStats);

const flexpoolConfig = require("./configs/flexpool.json");
const { flexpool: flexPoolStats } = require("./flexpool");
const flexpool = createPool(flexpoolConfig, flexPoolStats);

const ezilConfig = require("./configs/ezil.json");
const { ezil: ezilPoolStats } = require("./ezil");
const ezil = createPool(ezilConfig, ezilPoolStats);

const ethermineConfig = require("./configs/ethermine.json");
const { ethermine: etherminePoolStats } = require("./ethermine");
const ethermine = createPool(ethermineConfig, etherminePoolStats);

module.exports = { unmineable, flexpool, ezil, ethermine };
