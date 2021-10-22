const isDev = process.env.NODE_ENV === "development";
const { createWindow } = require("./createWindow");
const { createTray } = require("./createTray");
const { init } = require("./init");

function electron() {
  const state = { win: null, isDev, appName: "BeBoMining" };
  return {
    ...createWindow(state),
    ...createTray(state),
    ...init(state),
    get win() {
      return state.win;
    }
  };
}

exports.electron = electron();
