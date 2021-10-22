const { sqlite3 } = require("@bebomining/server/sqlite3");

const { add } = require("./add");
const { getWallet } = require("./getWallet");
const { remove } = require("./remove");

function wallets() {
  const state = { db: sqlite3 };
  return {
    ...add(state),
    ...getWallet(state),
    ...remove(state)
  };
}

exports.wallets = wallets();
