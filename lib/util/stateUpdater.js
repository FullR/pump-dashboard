import extendState from "./extendState";
import {identity} from "lodash";

export default function stateUpdater(component, key, selector=identity) {
  return (event) => {
    extendState(component, {[key]: selector(event)});
  };
}
