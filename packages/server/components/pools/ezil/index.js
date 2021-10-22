const { stats } = require("./stats");

exports.ezil = function ezil(config) {
  return {
    ...stats(config)
  };
};
