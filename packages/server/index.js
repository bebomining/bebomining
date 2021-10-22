const express = require("express");
const path = require("path");
const fs = require("fs");
const { routerV1 } = require("@bebomining/server/routers/v1");
const { sqlite3 } = require("@bebomining/server/sqlite3");
const { electron } = require("@bebomining/server/electron");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { app } = require("electron");
const userDataPath = app.getPath("userData");
const EventEmitter = require("events");

global._eventEmitter = new EventEmitter();

const basePath = process.env.PORTABLE_EXECUTABLE_DIR
  ? `${userDataPath}/data`
  : "./data";

(async function startApp() {
  const dbDir = path.resolve(basePath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
  }

  const dbPath = path.resolve(`${basePath}/sqlite.db`);

  await sqlite3.connect(dbPath);
  await sqlite3.init();

  const appServer = express();
  const port = process.env.PORT || 3000;
  const API_V1 = process.env.API_V1 || "/api/v1";

  appServer.use(express.urlencoded({ extended: true }));
  appServer.use(express.json());
  appServer.use(express.raw());
  appServer.use(cors());
  appServer.use(fileUpload());

  appServer.use(express.static(path.resolve("./public")));

  /* ROUTERS */
  appServer.use(`${API_V1}`, routerV1);
  /* ROUTERS */

  const server = appServer.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  // -------------------------------------------------------------------- //
  electron.init(server);
})();
