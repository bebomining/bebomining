const { stats } = require("./stats");

exports.ethermine = function ethermine(config) {
  return {
    ...stats(config)
  };
};
