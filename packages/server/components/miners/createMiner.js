const { start } = require("./start");
const { instances } = require("./instances");
const { releases } = require("./releases");
const { assets } = require("./assets");
const { installed } = require("./installed");
const { stop } = require("./stop");
const { startFromWorker } = require("./startFromWorker");
const { statsPort } = require("./statsPort");

exports.createMiner = function createMiner(config, miner = () => ({})) {
  return {
    ...miner(config),
    ...releases(config),
    ...instances(config),
    ...start(config),
    ...stop(config),
    ...assets(config),
    ...installed(config),
    ...startFromWorker(config),
    ...statsPort(config),
    get config() {
      return config;
    }
  };
};
