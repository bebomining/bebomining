const { sqlite3 } = require("@bebomining/server/sqlite3");

const { add } = require("./add");
const { get } = require("./get");
const { remove } = require("./remove");
const { supported } = require("./supported");

function coins() {
  const state = { db: sqlite3 };
  return {
    ...add(state),
    ...get(state),
    ...remove(state),
    ...supported(state)
  };
}

exports.coins = coins();
