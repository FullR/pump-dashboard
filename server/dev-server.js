const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("../webpack.config");

module.exports = (port, apiPort) => {
  const server = new WebpackDevServer(webpack(config), {
    quiet: true,
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
        console.error(error);
        reject(error);
      } else {
        console.log(`Dev server listening on port ${port}`);
        resolve();
      }
    });
  });
};
