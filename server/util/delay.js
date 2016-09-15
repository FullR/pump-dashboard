const {Observable} = require("rx");

module.exports = function delay(ms) {
  return Observable.create((observer) => {
    const timeout = setTimeout(() => {
      observer.onNext();
      observer.onCompleted();
    }, ms);

    return () => clearTimeout(timeout);
  });
}
