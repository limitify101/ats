const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/js/index.js",
    login: "./src/js/login.js",
    register: "./src/js/register.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // Injects styles into DOM
          "css-loader", // Turns CSS into CommonJS
          "sass-loader", // Compiles Sass to CSS
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/views/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "login.html",
      template: "./src/views/login.html",
    }),
    new HtmlWebpackPlugin({
      filename: "register.html",
      template: "./src/views/register.html",
    }),
  ],
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all", // This will split chunks from both synchronous and asynchronous imports
    },
  },
};
