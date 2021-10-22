const { stats } = require("./stats");

exports.unmineable = function unmineable(config) {
  return {
    ...stats(config)
  };
};
