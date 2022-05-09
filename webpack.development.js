/* eslint-disable */
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: "./dist",
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      __ServerAddress__: JSON.stringify("http://localhost:3000")
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