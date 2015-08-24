export default function getEventValue(event) {
  return event && event.target ? event.target.value : null;
};
