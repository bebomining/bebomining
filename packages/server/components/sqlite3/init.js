const init = state => ({
  async init() {
    for (const sql of sqlsInit) {
      await runInit(state, sql);
    }
    return this;
  }
});

const foreignKeys = "PRAGMA foreign_keys = ON";
const walletsSQL = `CREATE TABLE IF NOT EXISTS wallets (
  id integer PRIMARY KEY AUTOINCREMENT,
	walletName text NOT NULL UNIQUE COLLATE NOCASE
);`;

const workersSQL = `CREATE TABLE IF NOT EXISTS workers (
	id integer PRIMARY KEY AUTOINCREMENT,
	workerName text NOT NULL UNIQUE COLLATE NOCASE,
	poolName text NOT NULL,
  poolRegion text NOT NULL,
  poolPort integer NOT NULL,
  coinName text NOT NULL COLLATE NOCASE,
  algo text NOT NULL,
  walletName text NOT NULL COLLATE NOCASE,
	minerName text NOT NULL,
  minerAssetId integer NOT NULL,
  minerTagName text NOT NULL,
	gpus text NOT NULL,
  minerMode text NOT NULL,
  FOREIGN KEY(walletName, coinName)
  REFERENCES coins(walletName, coinName)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);`;

const coinsSQL = `CREATE TABLE IF NOT EXISTS coins (
	coinName text NOT NULL COLLATE NOCASE,
  address text NOT NULL,
  walletName text NOT NULL COLLATE NOCASE,
  FOREIGN KEY(walletName)
  REFERENCES wallets(walletName)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  PRIMARY KEY(coinName, walletName)
);`;

const sqlsInit = [foreignKeys, walletsSQL, coinsSQL, workersSQL];

async function runInit(state, sql) {
  return new Promise((resolve, reject) => {
    state.db.run(sql, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

exports.init = init;
