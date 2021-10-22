const selectAll = state => ({
  async selectAll(sql, params = []) {
    return new Promise((resolve, reject) => {
      state.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
});

exports.selectAll = selectAll;
