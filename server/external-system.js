const {transform, map} = require("lodash");
const {Observable, Observer} = require("rx");
const gpio = require("./gpio");
const pumpCycle = require("./pump-cycle");
const pinConfig = require("../pin-config");

const log = console.log.bind(console);
const identity = (v) => v;
const negate = (v) => !v;

function inputObservable(pinId, inverted) {
  return Observable.create((observer) => {
    let stopWatching = gpio.watchPin(pinId, (value) => {
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
    (value) => gpio.setPinValue(pinId, value).catch(log),
    log
  );
}

module.exports = function externalSystem({
  timeouts={},
  log=log,
  logError=log,
  pump="1"
}={}) {
  const outputsConfigured = Promise.all(map(pinConfig.outputs, ({pin, pinName}, hardwareName) => {
    log(`Initializing output for ${hardwareName} - ${pinName} - GPIO ${pin}`);
    return gpio.setupOutputPin(pin, false)
      .then(() => log(`Successfully initialized output ${hardwareName}`))
      .catch((error) => {logError(`Failed to initialize output ${hardwareName}: ${error}`); throw error;});
  }));

  const inputsConfigured = Promise.all(map(pinConfig.inputs, ({pin, pinName}, hardwareName) => {
    log(`Initializing input for ${hardwareName} - ${pinName} - GPIO ${pin}`);
    return gpio.setupInputPin(pin, false)
      .then(() => log(`Successfully initialized output ${hardwareName}`))
      .catch((error) => {logError(`Failed to initialize output ${hardwareName}: ${error}`); throw error;});
  }));

  const pinsConfigured = Promise.all([outputsConfigured, inputsConfigured]);

  const inputObservables =  transform(pinConfig.inputs, (inputs, {pin, inverted}, pinId) => {
    inputs[pinId] = inputObservable(pin, inverted);
  });

  const outputObservers = transform(pinConfig.outputs, (outputs, {pin}, pinId) => {
    outputs[pinId] = outputObserver(pin);
  });

  outputObservers.closeValves = Observer.create(
    (value) => {
      outputObservers.closeValve1.onNext(value);
      outputObservers.closeValve2.onNext(value);
    }
  );

  outputObservers.runPump = outputObservers["startPump" + pump];
  outputObservers.openValve = outputObservers["openValve" + pump];

  inputObservables.valveOpened = inputObservables["valve" + pump + "Opened"];
  return Observable.fromPromise(Promise.all([outputsConfigured, inputsConfigured]))
    .flatMap(() => pumpCycle({
      inputs: inputObservables,
      outputs: outputObservers,
      timeouts,
      log
    }))
}
