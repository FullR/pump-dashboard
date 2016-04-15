import {transform, map} from "lodash";
import {Observable, Observer} from "rx";
import gpio from "./gpio";
import pumpCycle from "./pump-cycle";
import pinConfig from "./pin-config";

const log = console.log.bind(console);
const identity = (v) => v;
const negate = (v) => !v;

function inputObservable(pinId, inverted) {
  return Observable.create((observer) => {
    var stopWatching = gpio.watchPin(pinId, (value) => {
      observer.onNext(inverted ? !value : value);
    });
      
    return () => {
      if(stopWatching) {
        stopWatching();
        stopWatching = null;
      }
    };
  });
}

function outputObserver(pinId) {
  return Observer.create(
    (value) => gpio.setPinValue(pinId, value),
    log
  );
}

export default function externalSystem({
  timeouts={},
  log,
  pump="1"
}={}) {
  const outputsConfigured = Promise.all(map(pinConfig.outputs, ({pin, pinName}, hardwareName) => {
    console.log(`Initializing output for ${hardwareName} - ${pinName} - GPIO ${pin}`);
    return gpio.setupOutputPin(pin, false)
      .then(() => log(`Successfully initialized output ${hardwareName}`))
      .catch((error) => {log(`Failed to initialize output ${hardwareName}: ${error}`); throw error;});
  }));
  const inputsConfigured = Promise.all(map(pinConfig.inputs, ({pin, pinName}, hardwareName) => {
    console.log(`Initializing input for ${hardwareName} - ${pinName} - GPIO ${pin}`);
    return gpio.setupInputPin(pin, false)
      .then(() => log(`Successfully initialized output ${hardwareName}`))
      .catch((error) => {log(`Failed to initialize output ${hardwareName}: ${error}`); throw error;});
  }));

  const pinsConfigured = Promise.all([outputsConfigured, inputsConfigured]);

  const inputObservables =  transform(pinConfig.inputs, (inputs, {pin, inverted}, pinId) => {
    inputs[pinId] = inputObservable(pin, inverted);
  });
  
  const outputObservers = transform(pinConfig.outputs, (outputs, {pin}, pinId) => {
    outputs[pinId] = outputObserver(pin);
  });
  
  return Observable.fromPromise(Promise.all([outputsConfigured, inputsConfigured]))
    .flatMap(() => pumpCycle({
      inputs: inputObservables, 
      outputs: outputObservers, 
      timeouts, 
      log
    }))
}

