import {camelCase} from "lodash";
const requireReducer = require.context(".", true, /\.\/.+\/index.js/);

module.exports = requireReducer.keys().reduce((reducers, filename) => {
  const name = filename.split("/")[1]; // dash-case-name
  const id = camelCase(name);
  reducers[name] = requireReducer(filename);

  return reducers;
}, {});
