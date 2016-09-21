const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("../webpack.config");
const log = require("./log");

module.exports = (port, apiPort) => {
  const server = new WebpackDevServer(webpack(webpackConfig), {
    //quiet: true,
    stats: {
      colors: true
    },
    proxy: {
      "/api": `http://localhost:${apiPort}`
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(port, (error) => {
      if(error) {
        log.error(`Failed to start development server: ${error}`);
        reject(error);
      } else {
        log.info(`Development server listening on port ${port}`);
        resolve();
      }
    });
  });
};
