import {camelCase} from "lodash";

const defaultCreateFn = () => ({});

export default function actionRouter(initialState, actions) {
  function actionRouterFn(state=initialState, action) {
    if(action.type in actions && actions[action.type].reduce) {
      return actions[action.type].reduce(state, action);
    }
    return state;
  }

  actionRouterFn.actions = Object.entries(actions).reduce((actions, [name, {create=defaultCreateFn}]) => {
    actions[camelCase(name)] = (...args) => {
      const action = create(...args);
      action.type = name;
      return action;
    };
    return actions;
  }, []);

  return actionRouterFn;
}
