const { app, BrowserWindow, ipcMain } = require("electron");
const { settings } = require("@bebomining/server/settings");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

exports.init = state => ({
  init(server) {
    settings.init();

    app.whenReady().then(() => {
      this.createWindow();
      state.win.tray = this.createTray();

      ipcMain.on("reloadPage", function () {
        state.win.reload();
      });

      ipcMain.on("relaunch", function () {
        const opt = {};
        opt.args = process.argv.slice(1).concat(["--relaunch"]);
        opt.execPath = process.execPath;
        if (
          app.isPackaged &&
          process.env.PORTABLE_EXECUTABLE_FILE != undefined
        ) {
          opt.execPath = process.env.PORTABLE_EXECUTABLE_FILE;
        }

        app.relaunch(opt);
        app.exit();
      });

      ipcMain.on("onCloseApp", function () {
        app.exit();
        server.close();
      });

      ipcMain.on("onDisclaimerAccepted", function () {
        settings.acceptDisclaimer();
      });

      ipcMain.on("onDisclaimerRejected", function () {
        app.exit();
        server.close();
      });

      state.win.on("ready-to-show", () => {
        state.win.webContents.send("onUserSettings", settings.userSettings);
      });

      if (app.isPackaged) {
        app.setLoginItemSettings({
          openAtLogin: true,
          openAsHidden: true,
          path: process.env.PORTABLE_EXECUTABLE_FILE
        });
      }
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }
});
