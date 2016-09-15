const {Observable} = require("rx");

module.exports = function maybeTimeout(observable, ms, errorText) {
  return ms ? observable.timeout(ms, Observable.throw(new Error(errorText))) : observable;
}
