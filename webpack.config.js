/**
 * [ When mode is "production" ]
 * ・ Reduced capacity
 * ・ Good performance
 * ・ Increases build time
 * ・ Does not support source maps
 *
 * [ When mode is "development" ]
 * ・ Expands capacity
 * ・ Lower performance
 * ・ Build time is short
 * ・ Support for source maps
 */
//const MODE = "production";

// To use path library
const path = require("path");

/**
 * Whether to use source maps or not.
 * (when mode is production, source maps are not used)
 */
const enabledSourceMap = process.env.NODE_ENV === "development";
const disabledImageminPlugin = process.env.NODE_ENV === "development";

/**
 * Put plugins into variables
 */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInjector = require("html-webpack-injector");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const ImageminMozjpeg = require("imagemin-mozjpeg");
const TerserPlugin = require("terser-webpack-plugin");

const { truncate } = require("fs");

/**
 * Configure of Webpack
 */
const webpackConfig = {
  //mode: MODE,

  // precisely control what bundle information gets displayed
  stats: "normal",

  /**
   * Work directory
   *
   * Must be specified as absolute path.
   */
  // context: `${__dirname}/src/`,
  context: path.resolve(__dirname, "src"),

  /**
   * Entry point
   *
   * If you use join, it will set the path
   * to match the OS environment.
   */
  entry: {
    main: path.join(__dirname, "/src", "/js", "main.js"),
    "vendors/pacejs_head": path.join(
      __dirname,
      "/src",
      "/js",
      "/vendors",
      "pace.js"
    ),
  },

  // target: 'node',

  /**
   * Output file settings
   *
   * Must be specified as absolute path.
   */
  output: {
    // Directory name of the output file
    path: path.join(__dirname, "/dist"),

    // name of the output file
    filename: "js/[name].bundle.js",

    /**
     * It automatically determines the public path from either
     * `import.meta.url`, `document.currentScript`, `<script />` or `self.location`.
     */
    publicPath: "auto",

    // Specify the output destination for Asset Modules.
    // assetModuleFilename: "assets/[name][ext][query]",
  },

  /**
   * Start up a local development environment.
   * The browser will automatically open localhost at runtime.
   */
  devServer: {
    // Set the root folder to devServer.
    static: {
      directory: path.join(__dirname, "dist"),
    },

    // Specify open: true, the browser will be launched automatically.
    // open: true,
    open: {
      app: {
        name: "Google Chrome",
        // arguments: ["--incognito", "--new-window"],
      },
    },

    // port number
    port: 9999,

    // Enable webpack's Hot Module Replacement feature
    hot: true,

    // configure a list of globs/directories/files to watch for file changes
    watchFiles: ["src/index.html"],
  },

  // Settings watch options
  watchOptions: {
    ignored: ["**/node_modules"],
  },

  // Configure each module
  module: {
    rules: [
      // Congigure babel-loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            // Using Babel
            loader: "babel-loader",

            // Specify Babel options
            options: {
              presets: [
                // Convert ES2021 to ES5 by specifying presets
                [
                  "@babel/preset-env",
                  {
                    targets: [
                      // Last version of each browser
                      "last 1 version",

                      // Browser versions with a market share of 1% or more
                      "> 1%",

                      // All Node.js versions
                      "maintained node versions",

                      /**
                       * [ dead ]
                       * Browser versions that have not been updated
                       * within the last 24 months.
                       *
                       * -> Therefore, combine with "not" to use as "not dead".
                       */
                      "not dead",
                    ],

                    /**
                     *
                     * Option to specify how to handle Polyfill in @babel/preset-env
                     *
                     * "usage"
                     * -> Apply only Polyfill that is now required by each file
                     *
                     * "entry"
                     * -> Replace import statements in core-js
                     * with modules required by the target browser
                     *
                     * false
                     * -> Do not Polyfill (default)
                     */
                    useBuiltIns: "usage",

                    // Use 3.x of corejs
                    corejs: 3,
                  },
                ],
              ],
            },
          },
        ],
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Expand CSS within <link> tags
          //"style-loader",

          // Enable the option to export CSS files
          {
            loader: MiniCssExtractPlugin.loader,
          },

          // Bundle CSS with JS
          {
            loader: "css-loader",
            options: {
              // Disable the inclusion of the url() method with CSS
              url: true,

              // Use source map or not
              sourceMap: enabledSourceMap,

              /**
               * 0 -> no loaders (default);
               * 1 -> postcss-loader;
               * 2 -> postcss-loader, sass-loader
               */
              importLoaders: 2,
            },
          },

          // Configure for PostCSS
          {
            loader: "postcss-loader",
            options: {
              sourceMap: enabledSourceMap,
              postcssOptions: {
                plugins: [
                  // Enable Autoprefixer and add vendor prefix automatically
                  ["autoprefixer", { grid: true }],
                ],
              },
            },
          },

          /**
           * Resolove path issue of sass files.
           *
           * It has to enabled sourcemap of loader before 'resolve-url-loader'.
           */
          {
            loader: "resolve-url-loader",
          },

          // Bundle Sass with CSS
          {
            loader: "sass-loader",
            options: {
              // To use resolve-url-loader
              sourceMap: true,
            },
          },
        ],
      },

      /**
       * Configure html loader
       *
       * convert HTML source code into a format
       * that can be processed by webpack.
       */
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      /**
       * Configure asset modules
       *
       * asset/resource -> file-loader
       * asset/inline -> url-loader
       * asset/source -> raw-loader
       */
      {
        /**
         * Specify the extension of the target asset file
         * by regular expression
         *
         * image files (png|svg|jpe?g|gif)
         */
        test: /\.(png|jpe?g|gif)$/i,

        generator: {
          filename: "images/[name][ext][query]",
        },

        type: "asset/resource",
      },
      {
        // image files (svg)
        test: /\.(svg)$/i,

        generator: {
          filename: "images/svg/[name][ext][query]",
        },

        type: "asset/resource",
      },
      {
        // font files (woff|woff2|eot|ttf|otf)
        test: /\.(woff|woff2|eot|ttf|otf)$/i,

        generator: {
          filename: "fonts/[name][ext][query]",
        },

        // Copy and output images
        type: "asset/resource",
      },

      // Bundle modernizr
      // {
      //   loader: "webpack-modernizr-loader",
      //   test: /\.modernizrrc\.js$/,
      //   // Uncomment this when you use `JSON` format for configuration
      //   // type: 'javascript/auto'
      // },
    ],
  },

  // Plugins
  plugins: [
    // Delete unnecessary files and folders in dist
    new CleanWebpackPlugin(),

    // Specify how to output the html files in src
    new HtmlWebpackPlugin({
      title: "Penguin Website",
      filename: "index.html",
      template: path.join(__dirname, "/src", "index.html"),

      // Choose in "false, 'head', 'body', true"
      // inject: "body",

      minify: false,

      /**
       * Use with HtmlWebpackInjector.
       *
       * For js files that you want to put in the head tag,
       * add _head to the end of the file name.
       */
      chunks: ["main", "vendors/pacejs_head"],
    }),

    new HtmlWebpackInjector(),

    // Set the icon
    new FaviconsWebpackPlugin({
      logo: "./images/svg/logo.svg",

      // optional can be 'webapp' or 'light' - 'webapp' by default
      mode: "light",

      // optional can be 'webapp' or 'light' - 'light' by default
      devMode: "light",

      prefix: "images/svg/",
    }),

    // Specify how to output the extracted CSS
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),

    // Specify which folder to copy from and to which folder
    new CopyPlugin({
      patterns: [
        // Copy the images directory
        {
          //from: `${path.resolve(__dirname, "src")}/images/`,
          //to: `${path.resolve(__dirname, "dist")}/images/`
          from: `${__dirname}/src/images/penguins`,
          to: `${__dirname}/dist/images/penguins`,
        },

        // Copy the fonts directory
        // {
        //   from: `${__dirname}/src/assets/fonts/`,
        //   to: `${__dirname}/dist/fonts/`,
        // },
      ],
    }),

    // Specify the image compression process
    new ImageminPlugin({
      disable: disabledImageminPlugin,
      test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [
        ImageminMozjpeg({
          quality: 85,
          progressive: true,
        }),
      ],
      pngquant: {
        quality: "70-85",
      },
      gifsicle: {
        interlaced: false,
        optimizationLevel: 10,
        colors: 256,
      },
      svgo: {},
    }),
  ],

  /**
   * Not outputting LICENSE.txt included main.js
   */
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            // Do not output console.log
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },

  /**
   * enable cache
   */
  cache: {
    type: "filesystem",
    allowCollectingMemory: true,
    buildDependencies: {
      // This makes all dependencies of this file - build dependencies
      config: [__filename],
      // By default webpack and loaders are build dependencies
    },
  },

  /**
   * Create aliases
   *
   * import or require certain modules more easily.
   */
  // resolve: {
  //   alias: {
  //     "~": path.resolve(__dirname, "/src"),
  //     modernizr$: path.resolve(__dirname, "/js/vendors/.modernizrrc.js"),
  //   },
  // },
};

// Apply
module.exports = webpackConfig;
//export default webpackConfig
