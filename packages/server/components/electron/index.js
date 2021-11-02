const isDev = process.env.NODE_ENV === "development";
const { createWindow } = require("./createWindow");
const { createTray } = require("./createTray");
const { init } = require("./init");
const { killProcesses } = require("./killProcesses");

function electron() {
  const state = { win: null, isDev, appName: "BeBoMining" };
  return {
    ...createWindow(state),
    ...createTray(state),
    ...init(state),
    ...killProcesses(state),
    get win() {
      return state.win;
    }
  };
}

exports.electron = electron();
