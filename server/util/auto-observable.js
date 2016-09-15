const {Observable} = require("rx");
const {noop} = require("lodash");

module.exports = function autoObservable(bodyFn=noop) {
  return Observable.create((observer) => {
    bodyFn();
    observer.onNext();
    observer.onCompleted();
  });
}
