const { ResponseError } = require("@bebomining/server/errors");
const miners = require("@bebomining/server/miners");

exports.getAllInstalledMiners = async function getAllInstalledMiners(
  req,
  res,
  next
) {
  try {
    const promises = Object.keys(miners).map(minerName =>
      miners[minerName].installed()
    );
    const allResults = await Promise.all(promises);

    const results = allResults.filter(Boolean);

    if (results.length <= 0) {
      const error = new Error(`No Miners installed!`);
      error.statusCode = 404;
      throw error;
    }

    const { algo } = req.query;

    req.locals = {
      response: {
        results: results
          .reduce((acc, res) => [...acc, ...res], [])
          .filter(
            ({ algoSupported }) =>
              !algo ||
              algoSupported.find(
                ({ value }) => value.toLowerCase() === algo.toLowerCase()
              )
          )
          .sort((a, b) => a.minerName.localeCompare(b.minerName)),
        statusCode: 200,
        status: "success"
      }
    };

    next();
  } catch (error) {
    const responseError = ResponseError(error);
    next(responseError);
  }
};
