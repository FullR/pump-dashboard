export default function bindEach(target, ...fnNames) {
  fnNames.forEach((fnName) => {
    if(typeof target[fnName] === "function") {
      target[fnName] = target[fnName].bind(target);
    }
  });
  return target;
}
