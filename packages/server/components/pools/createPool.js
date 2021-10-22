const { coins } = require("./coins");
const { regions } = require("./regions");
const { algos } = require("./algos");

const isDev = process.env.NODE_ENV === "development";
exports.createPool = function createPool(config, pool = () => ({})) {
  config.private.apiBaseURL = isDev
    ? "http://localhost:8084"
    : "https://bebomining.github.io/bebomining";

  return {
    ...pool(config),
    ...coins(config),
    ...regions(config),
    ...algos(config),
    get config() {
      return config;
    }
  };
};
