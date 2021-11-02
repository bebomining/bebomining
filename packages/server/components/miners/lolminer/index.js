const { stats } = require("./stats");
exports.lolminer = function (config) {
  return {
    parser: {
      ...gpus(config),
      ...algo(config)
    },
    ...stats(config)
  };
};

const gpus = () => ({
  gpus(list) {
    return list.split(",").map(Number).join(",");
  }
});

const algo = () => ({
  algo(algo) {
    return algo.trim().toUpperCase();
  }
});
