const { stats } = require("./stats");
exports.nbminer = function (config) {
  return {
    parser: { ...gpus(config) },
    ...stats(config)
  };
};

const gpus = () => ({
  gpus(list) {
    return list.split(",").map(Number).join(",");
  }
});
