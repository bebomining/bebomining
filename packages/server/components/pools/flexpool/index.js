const { stats } = require("./stats");

exports.flexpool = function flexpool(config) {
  return {
    ...stats(config)
  };
};
