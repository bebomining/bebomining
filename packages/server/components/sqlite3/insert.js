const insert = state => ({
  async insert(target, params) {
    return new Promise((resolve, reject) => {
      const sql = `${target} VALUES (${params.map(() => "?").join(",")})`;

      state.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }
});

exports.insert = insert;
