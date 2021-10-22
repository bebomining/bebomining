const { sqlite3 } = require("@bebomining/server/sqlite3");

const { add } = require("./add");
const { get } = require("./get");
const { getAll } = require("./getAll");
const { replace } = require("./replace");
const { remove } = require("./remove");
const { addToRunning } = require("./addToRunning");
const { getRunningById } = require("./getRunningById");
const { removeFromRunning } = require("./removeFromRunning");

function workers() {
  const state = { db: sqlite3, runnings: [] };
  return {
    ...add(state),
    ...get(state),
    ...getAll(state),
    ...remove(state),
    ...replace(state),
    ...addToRunning(state),
    ...getRunningById(state),
    ...removeFromRunning(state),
    get runnings() {
      return state.runnings;
    }
  };
}

exports.workers = workers();
