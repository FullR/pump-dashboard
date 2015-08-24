import {Observable} from "rx";

export default function fakeRequest(ms=1000, result, error) {
  return Observable.create((observer) => {
    const timeout = setTimeout(() => {
      if(!error) {
        observer.onNext(result);
        observer.onCompleted();
      } else {
        observer.onError(new Error(error));
      }
    }, ms);

    return () => clearTimeout(timeout);
  });
}
