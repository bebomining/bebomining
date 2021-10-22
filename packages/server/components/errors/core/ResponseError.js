exports.ResponseError = function (err, ...args) {
  const error = err instanceof Error ? err : new Error(err);
  error.error = err instanceof Error ? err.message : err;
  error.status = "error";
  error.statusCode = error.statusCode || 500;

  args.forEach(({ key, value }) => {
    if (error[key] === undefined) {
      error[key] = value;
    }
  });

  return error;
};
