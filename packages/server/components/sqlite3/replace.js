const replace = state => ({
  async replace(sql, values) {
    return new Promise((resolve, reject) => {
      state.db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }
});

exports.replace = replace;
