const {
  successHandler,
  errorHandler
} = require("@bebomining/server/routes-handler");

const { getCoins } = require("./handlers/getCoins");

const handleGetDonationCoins = [getCoins, successHandler, errorHandler];

module.exports = {
  handleGetDonationCoins
};
