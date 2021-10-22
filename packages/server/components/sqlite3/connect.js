const sqlite3 = require("sqlite3");
const path = require("path");

const connect = state => ({
  async connect(target) {
    const that = this;
    return new Promise((resolve, reject) => {
      const targetPath = path.resolve(target);
      state.db = new sqlite3.Database(targetPath, err => {
        if (err) {
          reject(err);
        } else {
          resolve(that);
          console.log(`Connected to the ${target} database.`);
        }
      });
    });
  }
});

exports.connect = connect;
