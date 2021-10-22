exports.errorHandler = function errorHandler(err, req, res, nextomit) {
  if (err !== undefined && typeof err.statusCode === "number") {
    res.status(err.statusCode).send(err);
  } else {
    res.send(err);
  }
};
