import {Observable, Observer, Subject, BehaviorSubject} from "rx";
import delay from "./util/delay";
import isStream from "./util/isStream";
import pumpCycle from "./pump-cycle";

const isTrue = (v) => !!v;

function fakeProcess(time, onCompleteObserver, value=true) {
  setTimeout(() => onCompleteObserver.onNext(value), time);
}

export default function testSystem({
  times={
    valve1CloseTime: 10,
    valve2CloseTime: 10,
    valveOpenTime: 10,
    primeTime: 10,
    pumpTime: 10
  }, 
  timeouts={},
  initialValues={}, 
  debug=false, 
  lowPressure=false,
  log
}={}) {
  const inputs = {
    valve1Closed: new BehaviorSubject(!!initialValues.valve1Closed),
    valve2Closed: new BehaviorSubject(!!initialValues.valve2Closed),
    valveOpened: new BehaviorSubject(!!initialValues.valveOpened),
    primeComplete: new BehaviorSubject(!!initialValues.primeComplete),
    lowPressure: new BehaviorSubject(!!initialValues.lowPressure),
    tankIsFull: new BehaviorSubject(!!initialValues.tankIsFull),
    emergencyStop: new BehaviorSubject(!!initialValues.emergencyStop)
  };

  const outputs = {
    closeValves: Observer.create((on) => {
      if(on) {
        fakeProcess(times.valve1CloseTime, inputs.valve1Closed);
        fakeProcess(times.valve2CloseTime, inputs.valve2Closed);
      }
    }),
    openValve: Observer.create((on) => {
      if(on) {
        fakeProcess(times.valveOpenTime, inputs.valveOpened);
      }
    }),
    runPrime: Observer.create((on) => {
      if(on) {
        fakeProcess(times.primeTime, inputs.primeComplete);
      }
    }),
    runPump: Observer.create((on) => {
      if(on) {
        fakeProcess(times.pumpTime, lowPressure ? inputs.lowPressure : inputs.tankIsFull);
      }
    })
  };

  return pumpCycle({inputs, outputs, timeouts, log});
}
