const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const { CheckerPlugin } = require("awesome-typescript-loader");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

module.exports = [
  {
    mode: "production",
    optimization: {
      minimize: false
    },
    entry: "./src/GanttElastic.tsx",
    output: {
      filename: "GanttElastic.js",
      // eslint-disable-next-line no-undef
      path: path.join(__dirname, "./dist"),
      library: "GanttElastic",
      libraryTarget: "commonjs2",
      libraryExport: "default"
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"],
      alias: {
        // eslint-disable-next-line no-undef
        "@": path.join(__dirname, "src")
      }
    },
    module: {
      rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          // loader: "awesome-typescript-loader",
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["lodash"]
            }
          }
        }
      ]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: [
      {
        react: "React",
        "react-dom": "ReactDOM"
      },
      /^(demo|\$)$/i
    ],
    plugins: [new CheckerPlugin(), new LodashModuleReplacementPlugin()]
  },
  {
    mode: "production",
    optimization: {
      minimize: true,
      namedModules: false,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false
          }
        })
      ]
    },
    entry: "./src/GanttElastic.tsx",
    output: {
      filename: "GanttElastic.min.js",
      // eslint-disable-next-line no-undef
      path: path.join(__dirname, "./dist"),
      library: "GanttElastic",
      libraryTarget: "commonjs2",
      libraryExport: "default"
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"],
      alias: {
        // eslint-disable-next-line no-undef
        "@": path.join(__dirname, "src")
      }
    },
    module: {
      rules: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          // loader: "awesome-typescript-loader"
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: ["lodash"]
            }
          }
        }
      ]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: [
      {
        react: "React",
        "react-dom": "ReactDOM"
      },
      /^(demo|\$)$/i
    ],
    plugins: [new CheckerPlugin(), new LodashModuleReplacementPlugin()]
  }
];
