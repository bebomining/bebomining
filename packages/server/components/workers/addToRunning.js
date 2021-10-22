const addToRunning = state => ({
  addToRunning(workerWithPid) {
    state.runnings.push(workerWithPid);
    return workerWithPid;
  }
});

exports.addToRunning = addToRunning;
