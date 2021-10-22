const deleteRecord = state => ({
  async deleteRecord(sql, params) {
    return new Promise((resolve, reject) => {
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

exports.deleteRecord = deleteRecord;
