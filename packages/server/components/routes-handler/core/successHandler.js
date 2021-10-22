const responseDefault = {
  status: "ok",
  statusCode: 200,
  message: "No Content!"
};

exports.successHandler = function successHandler(req, res, nextomit) {
  const { response = responseDefault } = req?.locals;
  const { statusCode = 200 } = response;
  res.status(statusCode).send(response);
};
