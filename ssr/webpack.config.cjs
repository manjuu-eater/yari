const path = require("path");

// eslint-disable-next-line node/no-unpublished-require
const nodeExternals = require("webpack-node-externals");
// eslint-disable-next-line node/no-unpublished-require
const webpack = require("webpack");

const dirname = __dirname;
const webpackImportMetaLoader = require.resolve(
  "./webpack-import-meta-loader.cjs"
);

module.exports = {
  context: path.resolve(dirname, "."),
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].cjs",
    sourceMapFilename: "[name].js.map",
    libraryTarget: "commonjs2",
  },
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  // See all options here:
  // https://webpack.js.org/configuration/stats/
  stats: "errors-warnings",
  resolve: {
    modules: ["node_modules", "src"],
    extensions: ["*", ".js", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: webpackImportMetaLoader,
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: true,
              titleProp: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader?outputPath=/distimages/"],
      },
      { test: /\.(css|scss)$/, loader: "ignore-loader" },
    ],
  },
  externals: nodeExternals(),
  devtool: "source-map",
  plugins: [
    // This makes is so that there is only one `ssr/dist/main.js` (and
    // `ssr/dis/main.js.map`) file. There's no point in code splitting the
    // code that is run by Node. Code splitting is something that we do to benefit
    // users who consume our code through a browser.
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
