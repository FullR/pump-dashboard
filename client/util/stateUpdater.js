import extendState from "./extendState";
import {identity, transform} from "lodash";

export default function stateUpdater(component, key, selector=identity) {
  return (event) => {
    const value = selector(event);
    if(component.state[key] !== value) {
      extendState(component, {[key]: value});
    }
  };
}

stateUpdater.many = (component, updateMap) => {
  return transform(updateMap, (updaters, selector, key) => {
    updaters[key] = stateUpdater(component, key, selector);
  });
};
