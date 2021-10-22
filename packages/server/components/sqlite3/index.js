const { connect } = require("./connect");
const { init } = require("./init");
const { insert } = require("./insert");
const { selectWhere } = require("./selectWhere");
const { selectAll } = require("./selectAll");
const { deleteRecord } = require("./deleteRecord");
const { replace } = require("./replace");

function sqlite3() {
  const state = { db: null };
  return {
    ...connect(state),
    ...init(state),
    ...insert(state),
    ...replace(state),
    ...selectAll(state),
    ...selectWhere(state),
    ...deleteRecord(state),
    get db() {
      return state.db;
    }
  };
}

exports.sqlite3 = sqlite3();
