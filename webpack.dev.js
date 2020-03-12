const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const evalSourceMapMiddleware = require("react-dev-utils/evalSourceMapMiddleware");
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  entry: [
    "./src/demo.tsx",
    require.resolve("react-dev-utils/webpackHotDevClient")
  ],
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    // pathinfo: true,
    // There will be one main bundle, and one file per asynchronous chunk.
    // In development, it does not produce real files.
    filename: "static/js/bundle.js",
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: "static/js/[name].chunk.js",
    // We inferred the "public path" (such as / or /my-project) from homepage.
    // We use "/" in development.
    publicPath: "/"
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.join(__dirname, "src")
    }
  },
  devServer: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    // Enable gzip compression of generated files.
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: "info",
    // By default WebpackDevServer serves physical files from current directory
    // in addition to all the virtual build products that it serves from memory.
    // This is confusing because those files won’t automatically be available in
    // production build folder unless we copy them. However, copying the whole
    // project directory is dangerous because we may expose sensitive files.
    // Instead, we establish a convention that only files in `public` directory
    // get served. Our build script will copy `public` into the `build` folder.
    // In `index.html`, you can get URL of `public` folder with %PUBLIC_URL%:
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
    // Note that we only recommend to use `public` folder as an escape hatch
    // for files like `favicon.ico`, `manifest.json`, and libraries that are
    // for some reason broken when imported through Webpack. If you just want to
    // use an image, put it in `src` and `import` it from JavaScript instead.
    // contentBase: path.join(__dirname, "./dist"),
    // By default files from `contentBase` will not trigger a page reload.
    watchContentBase: true,
    // Enable hot reloading server. It will provide /sockjs-node/ endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the Webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    port: 3000,
    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    transportMode: "ws",
    // Prevent a WS client from getting injected as we're already including
    // `webpackHotDevClient`.
    injectClient: false,
    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: "/",
    before(app, server) {
      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(server));
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());
      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      // app.use(noopServiceWorkerMiddleware());
    }
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      // { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: "public/index.html"
    }),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: "../public"
    }),
    new webpack.HotModuleReplacementPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebook/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin("./node_modules"),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
