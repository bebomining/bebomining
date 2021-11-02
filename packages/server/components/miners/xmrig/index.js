const { stats } = require("./stats");
exports.xmrig = function (config) {
  return {
    parser: {},
    ...stats(config)
  };
};
