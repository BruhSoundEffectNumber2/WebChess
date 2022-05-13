/* eslint-disable */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    index: './src/server/chessServer.ts',
  },
  target: 'node',
  output: {
    filename: '[name].[contenthash].js',
    sourceMapFilename: '[file].[contenthash].map',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        exclude: [path.resolve(__dirname, 'node_modules/excalibur')],
        enforce: 'pre',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionWebpackPlugin(),
    new webpack.IgnorePlugin({resourceRegExp: /utf-8-validate/}),
    new webpack.IgnorePlugin({resourceRegExp: /bufferutil/}),
  ]
}