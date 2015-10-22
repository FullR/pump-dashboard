import {Observable} from "rx";
import {noop} from "lodash";

export default function autoObservable(bodyFn=noop) {
  return Observable.create((observer) => {
    bodyFn();
    observer.onNext();
    observer.onCompleted();
  });
}
