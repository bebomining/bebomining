const get = state => ({
  async get(filters = {}) {
    const WHERE = Object.keys(filters)
      ?.map(key => `${key} = ?`)
      ?.join(" ");

    if (typeof WHERE === "string" && WHERE.trim().length > 0) {
      const values = Object.values(filters);
      const sql = `SELECT rowid, * FROM coins WHERE ${WHERE}`;
      const results = await state.db.selectAll(sql, values);
      return results || [];
    } else {
      const sql = `SELECT rowid, * FROM coins`;
      const results = await state.db.selectAll(sql);
      return results || [];
    }
  }
});

exports.get = get;
