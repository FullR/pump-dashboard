import {extend} from "lodash";

export default function extendState(component, ...sources) {
  component.setState(extend({}, component.state, ...sources));
}
