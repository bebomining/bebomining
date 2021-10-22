const {
  successHandler,
  errorHandler
} = require("@bebomining/server/routes-handler");
const { createWallet } = require("./handlers/createWallet");
const { getWallets } = require("./handlers/getWallets");
const { deleteWallet } = require("./handlers/deleteWallet");

const handleWalletCreation = [createWallet, successHandler, errorHandler];
const handleGetWallets = [getWallets, successHandler, errorHandler];
const handleWalletDeletion = [deleteWallet, successHandler, errorHandler];

module.exports = {
  handleWalletCreation,
  handleGetWallets,
  handleWalletDeletion
};
