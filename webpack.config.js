const path = require("path");
const nodeExternals = require("webpack-node-externals");
const mode = process.env.NODE_ENV || "development";
const isDev = process.env.NODE_ENV !== "production";
const TerserPlugin = require("terser-webpack-plugin");

const optimization = isDev ? {} : {
  minimize: true,
  minimizer: [new TerserPlugin({
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  })]
}

module.exports = {
  target: "node",
  entry: "./packages/server/index.js",
  mode,
  devtool: false,
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "packages/server/build"),
  },

  externals: [nodeExternals({ allowlist: [/@bebomining/] })],
  optimization
};
