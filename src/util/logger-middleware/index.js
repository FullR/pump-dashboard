export default (store) => (next) => (action) => {
  const timerId = `Dispatched ${action.type}`;
  console.time(timerId);
  const result = next(action);
  console.timeEnd(timerId);
  return result;
};
