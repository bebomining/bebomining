const {
  successHandler,
  errorHandler
} = require("@bebomining/server/routes-handler");

const { addCoin } = require("./handlers/addCoin");
const { getCoins } = require("./handlers/getCoins");
const { deleteCoin } = require("./handlers/deleteCoin");
const { supportedCoins } = require("./handlers/supportedCoins");

const handleAddCoin = [addCoin, successHandler, errorHandler];
const handleGetCoins = [getCoins, successHandler, errorHandler];
const handleDeleteCoin = [deleteCoin, successHandler, errorHandler];
const handleSupportedCoins = [supportedCoins, successHandler, errorHandler];

module.exports = {
  handleAddCoin,
  handleGetCoins,
  handleDeleteCoin,
  handleSupportedCoins
};
