const remove = state => ({
  async remove({ id }) {
    const sql = "DELETE FROM coins WHERE rowid = ?";
    const result = await state.db.deleteRecord(sql, [id]);
    if (result.changes === 0) {
      const error = new Error(`Coins with ID: ${id} not found!`);
      error.statusCode = 404;
      throw error;
    }
    return result;
  }
});

exports.remove = remove;
