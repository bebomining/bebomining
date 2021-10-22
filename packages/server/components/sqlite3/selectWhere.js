const selectWhere = state => ({
  async selectWhere(sql, params) {
    return new Promise((resolve, reject) => {
      state.db.get(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
});

exports.selectWhere = selectWhere;
