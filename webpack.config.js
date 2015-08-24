
function extentions() {
  var exts = [];
  var length = arguments.length;
  for(var i = 0; i < length; i++) {
    exts.push(arguments[i]);
  }
  return new RegExp("\.(?:" + exts.join("|") + ")$");
}

module.exports = {
  context: __dirname + "/lib",
  entry: "./app.js",
  resolve: {
    root: __dirname + "/lib",
    extensions: ["", ".js"]
  },
  output: {
    path: __dirname + "/dist",
    filename: "app.js"
  },
  module: {
    loaders: [
      {test: extentions("js"), exclude: /node_modules/, loader: "babel-loader?stage=1"},
      {test: extentions("scss"), loader: "style!css!sass"},
      {test: extentions("less"), loader: "style!css!less"},
      {test: extentions("png", "jpg", "gif"), loader: "file-loader?name=images/[name].[hash].[ext]"}
    ]
  }
};
