export default function dateFromInputStrings(dateString, timeString, local) {
  return new Date(`${dateString}${local ? " " : "T"}${timeString}`);
}
