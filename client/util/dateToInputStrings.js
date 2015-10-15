
function pad(numStr, length) {
  while(numStr.length < length) numStr = `0${numStr}`;
  return numStr;
}

export default function dateToInputStrings(date, local) {
  if(local) {
    const [month, day, year] = date.toLocaleDateString().split("/");
    return {
      dateString: `${year}-${pad(month, 2)}-${pad(day, 2)}`,
      timeString: date.toLocaleTimeString(undefined, {hour12: false})
    };
  }
  const [dateString, timeString] = date.toISOString().replace(/\.\d*Z$/, "").split("T");
  return {dateString, timeString};
}
