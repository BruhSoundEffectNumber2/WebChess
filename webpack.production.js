/* eslint-disable */
const { merge } = require("webpack-merge");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const common = require("./webpack.common");
const webpack = require("webpack");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new CompressionWebpackPlugin(),
    new webpack.DefinePlugin({
      __ServerAddress__: JSON.stringify("https://WebChessServer.damonlewis.repl.co")
    }),
  ],
});

const productionConfig = merge([
  {
    output: {

      // Tweak this to match your GitHub project name
      publicPath: "/WebChess/",
    },
  },
]);