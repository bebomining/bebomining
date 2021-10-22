const path = require("path");
const { app, BrowserWindow } = require("electron");

exports.createWindow = state => ({
  createWindow() {
    const icon = path.resolve(__dirname, "../assets/icon.png");
    state.win = new BrowserWindow({
      width: 1024,
      height: 720,
      transparent: true,
      autoHideMenuBar: true,
      center: true,
      thickFrame: false,
      icon,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.resolve(__dirname, "../assets/js/preload.js")
      }
    });

    state.win.on("minimize", function (event) {
      event.preventDefault();
      state.win.setSkipTaskbar(true);
      state.win.webContents.send("onWinStatusChange", "minimize");
    });

    state.win.on("restore", function () {
      state.win.show();
      state.win.setSkipTaskbar(false);
      state.win.webContents.send("onWinStatusChange", "restore");
    });

    state.win.on("close", function (evt) {
      if (!app.isQuiting) {
        evt.preventDefault();
        state.win.minimize();
      }
    });

    if (state.isDev) {
      state.win.loadURL("http://localhost:8084/#/workers");
    } else {
      state.win.setMenu(null);
      // state.win.loadFile("./../client/index.html");
      state.win.loadURL("https://bebomining.github.io/bebomining/#/workers");
    }
  }
});
