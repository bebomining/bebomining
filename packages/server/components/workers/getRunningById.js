const getRunningById = state => ({
  getRunningById(workerId) {
    const worker = state.runnings.find(
      ({ id }) => Number(id) === Number(workerId)
    );
    return worker;
  }
});

exports.getRunningById = getRunningById;
