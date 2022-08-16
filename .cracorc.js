const { ModuleFederationPlugin } = require("webpack").container;

const deps = require("./package.json").dependencies;

module.exports = () => ({
  webpack: {
    configure: {
      output: {
        publicPath: "auto",
      },
    },
    module: {
      rules: [
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "assets/[name].[contenthash:8].[ext]",
          },
        },
        {
          test: /\.wav$/,
          loader: "file-loader",
        },
      ],
    },
    // plugins: {
    //   add: [
    //     new ModuleFederationPlugin({
    //       name: "workspace-mf",
    //       filename: "remoteEntry.js",
    //       remotes: {
    //       },
    //       shared: {
    //         ...deps,
    //         tsconfig: {
    //           singleton: true,
    //         },
    //         react: {
    //           singleton: true,
    //           requiredVersion: deps.react,
    //         },
    //         "react-dom": {
    //           singleton: true,
    //           requiredVersion: deps["react-dom"],
    //         },
    //       },
    //     }),
    //   ],
    // },
  },
});
