import Cylon from "cylon";
import {transform} from "lodash";
import {Observable, Observer} from "rx";
import pumpCycle from "./pump-cycle";
import pins from "./pin-config";

const identity = (v) => v;
const negate = (v) => !v;

function buttonObservable(device, mode) {
  if(mode) {
    mode = mode.toLowerCase();
  }
  return Observable.create((observer) => {
    function onPush() {
      observer.onNext(true);
    }

    function onRelease() {
      observer.onNext(false);
    }

    device.on("push", onPush);
    device.on("release", onRelease);

    return () => {
      device.removeListener("push", onPush);
      device.removeListener("release", onRelease);
    };
  })
  .map(mode === "falling" ? negate : identity);
}

function pinObserver(...devices) {
  return Observer.create(
    (v) => devices.forEach((d) => d.digitalWrite(v ? 1 : 0)),
    (error) => console.log(error),
    () => devices.forEach((d) => d.digitalWrite(0))
  );
}

export default function externalSystem({
  timeouts={},
  log,
  pump="1"
}={}) {
  const pin = (driver, io, name) => {
    const pinCfg = pins[io][name];
    if(!pinCfg) {
      console.log(name + " not found");
    }
    return {driver, pin: pinCfg.pin};
  };
  
  return Observable.create((observer) => Cylon.robot({
    connections: {beaglebone: {adaptor: "beaglebone"}},
    devices: {
      valve1Closed: pin("button", "inputs", "valve1Closed"),
      valve2Closed: pin("button", "inputs", "valve2Closed"),
      valve1Opened: pin("button", "inputs", "valve1Opened"),
      valve2Opened: pin("button", "inputs", "valve2Opened"),
      primeComplete: pin("button", "inputs", "primeComplete"),
      lowPressure: pin("button", "inputs", "lowPressure"),
      tankIsFull: pin("button", "inputs", "tankIsFull"),
      emergencyStop: pin("button", "inputs", "emergencyStop"),
     
      closeValve1: pin("direct-pin", "outputs", "closeValve1"),
      closeValve2: pin("direct-pin", "outputs", "closeValve2"),
      openValve1: pin("direct-pin", "outputs", "openValve1"),
      openValve2: pin("direct-pin", "outputs", "openValve2"),
      runPrime: pin("direct-pin", "outputs", "runPrime"),
      startPump1: pin("direct-pin", "outputs", "startPump1"),
      startPump2: pin("direct-pin", "outputs", "startPump2")
    },

    work() {
      const valve1Closed = buttonObservable(this.valve1Closed);
      const valve2Closed = buttonObservable(this.valve2Closed);
      const valveOpened = buttonObservable(pump === "1" ? this.valve1Opened : this.valve2Opened);
      const primeComplete = buttonObservable(this.primeComplete);
      const lowPressure = buttonObservable(this.lowPressure, pins.inputs.lowPressure.mode);
      const tankIsFull = buttonObservable(this.tankIsFull);
      const emergencyStop = buttonObservable(this.emergencyStop, pins.inputs.emergencyStop.mode);

      const closeValves = pinObserver(this.closeValve1, this.closeValve2); 
      const openValve = pinObserver(pump === "1" ? this.openValve1 : this.openValve2);
      const runPrime = pinObserver(this.runPrime);
      const runPump = pinObserver(pump === "1" ? this.startPump1 : this.startPump2);

      const inputs = {valve1Closed, valve2Closed, valveOpened, primeComplete, lowPressure, tankIsFull, emergencyStop};
      const outputs = {closeValves, openValve, runPrime, runPump};
      pumpCycle({inputs, outputs, timeouts, log}).subscribe(observer);
    }
  }).start()); 
}

