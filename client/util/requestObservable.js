import {Observable} from "rx";

export default function requestObservable(req) {
  return Observable.create((observer) => {
    let finished = false;

    req.end((error, res) => {
      finished = true;
      if(error) {
        observer.onError(error);
      } else {
        observer.onNext(res);
        observer.onCompleted();
      }
    });

    return () => {
      if(!finished) req.abort();
    };
  });
}
