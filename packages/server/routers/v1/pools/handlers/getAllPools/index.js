const { ResponseError } = require("@bebomining/server/errors");
const pools = require("@bebomining/server/pools");

exports.getAllPools = async function getAllPools(req, res, next) {
  try {
    const algoPromises = Object.values(pools).map(async pool => {
      const { private: omitPrivate, ...result } = pool.config;
      const algoSupported = await pool.algos();
      return { ...result, algoSupported };
    });

    const algos = await Promise.all(algoPromises);

    const results = algos
      .filter(({ algoSupported }) =>
        req?.query?.algo ? algoSupported[req?.query?.algo.toLowerCase()] : true
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    req.locals = {
      response: { statusCode: 200, results, status: "success" }
    };

    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
