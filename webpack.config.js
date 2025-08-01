const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const TerserPlugin = require("terser-webpack-plugin");

const queueList = [];

// Which files should be hashed
const resourceUrls = queueList
  .filter((item) => item.shouldHash)
  .map((item) => ({
    ...item,
    url: item.url.replace("build", ""),
  }));

class ModifyFilesPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "ModifyFilesPlugin",
      (compilation, callback) => {
        // Iterate through all compiled assets
        Object.keys(compilation.assets).forEach((filename) => {
          if (
            filename.endsWith(".js") &&
            (filename.startsWith("bundle") || filename.startsWith("chunks"))
          ) {
            // Modify the content of the file
            let content = compilation.assets[filename].source();
            // Example modification: append a comment
            let updatedSource = null;

            updatedSource = content.replace(
              /"images/g,
              '(window.domain ? window.domain : "") + "images'
            );

            // Update the asset with modified content
            compilation.assets[filename] = {
              source: () => updatedSource,
              size: () => updatedSource.length,
            };
          }
        });
        callback();
      }
    );
  }
}

module.exports = (env) => {
  return {
    entry: path.resolve(__dirname, "./src/index.js"),
    mode: "production",
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: "babel-loader",
              options: { presets: ["@babel/env"] },
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: "file-loader",
        },
        {
          test: /\.(scss|css)$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader", options: { url: false } },
            {
              loader: "sass-loader",
              options: {
                additionalData: (content) => {
                  return content.replace(
                    /@import ['"]\.\/styles\/font-JioType['"];/,
                    ""
                  );
                },
              },
            },
          ],
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, "build/"),
      filename: "bundle.[contenthash].js",
      chunkFilename: "chunks/[id].[chunkhash].js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "./public/index.html"),
      }),
      new Dotenv({
        path: `./environments/.env.${env.ENV_FILE}`,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "public",
            to: ({ absoluteFilename }) => {
              const isJsOrCss =
                absoluteFilename.endsWith(".js") ||
                absoluteFilename.endsWith(".css");
              const isInTargetDirectory = resourceUrls.some((item) => {
                const dir = path.join(__dirname, "public");
                const targetDir = path.join(dir, item.url);
                const isInDir = absoluteFilename.startsWith(dir);
                const relativePath = absoluteFilename.replace(targetDir, "");
                const depth = relativePath
                  .split(path.sep)
                  .filter(Boolean).length;

                return isInDir && depth === 1;
              });

              if (isJsOrCss && isInTargetDirectory) {
                return "[path][name].[contenthash][ext]";
              } else {
                return "[path][name][ext]";
              }
            },
            info: { minimized: true },
            globOptions: {
              ignore: ["**/index.html"],
            },
          },
          // { from: "public/streamplayer/index.html", to: "streamplayer/index.html" },
          // {
          //   from: "./src/styles/fonts",
          //   to: "fonts",
          // },
        ],
      }),
      new ModifyFilesPlugin(),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // This removes console.* statements
            },
          },
        }),
      ],
    },
  };
};
