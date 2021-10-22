const unmineableConfig = require("./../configs/unmineable.json");
const flexpoolleConfig = require("./../configs/flexpool.json");

module.exports = {
  [unmineableConfig.name]: apiResult => apiResult.coins,
  [flexpoolleConfig.name]: apiResult => {
    return apiResult.result.coins.map(({ ticker, name }) => ({
      symbol: ticker,
      name,
      network: name
    }));
  }
};
