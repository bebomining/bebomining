const path = require("path");
const { app, Tray, Menu, nativeImage } = require("electron");

exports.createTray = state => ({
  createTray() {
    const icon = path.resolve(__dirname, "../assets/icon.png");

    let trayIcon = nativeImage.createFromPath(icon);
    trayIcon = trayIcon.resize({ width: 16, height: 16 });
    const appIcon = new Tray(trayIcon);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Show",
        click: function () {
          state.win.show();
        }
      },
      {
        label: "Restart",
        click: function () {
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
        }
      },
      {
        label: "Exit",
        click: function () {
          app.isQuiting = true;
          app.quit();
        }
      }
    ]);

    appIcon.on("double-click", function () {
      state.win.show();
    });
    appIcon.setToolTip(state.appName);
    appIcon.setContextMenu(contextMenu);
    return appIcon;
  }
});
