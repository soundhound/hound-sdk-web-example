const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  entry: "./src/components/HoundifyUI.js",
  mode: "development",
  node: { fs: "empty", net: "empty", tls: "empty" },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
};
