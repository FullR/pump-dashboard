export default function formatRemaining(ms) {
  const {floor} = Math;
  const pluralize = (word, n) => n > 1 ? `${word}s` : word;

  const seconds = floor(ms / 1000) % 60;
  const minutes = floor(ms / (1000 * 60)) % 60;
  const hours = floor(ms / (1000 * 60 * 60)) % 24;
  const days = floor(ms / (1000 * 60 * 60 * 24));

  if(days) {
    return `${days} ${pluralize("day", days)}, ${hours} ${pluralize("hour", hours)}`;
  } else if(hours) {
    return `${hours} ${pluralize("hour", hours)}, ${minutes} ${pluralize("minute", minutes)}`;
  } else if(minutes) {
    return `${minutes} ${pluralize("minute", minutes)}, ${seconds} ${pluralize("second", seconds)}`;
  } else if(seconds) {
    return `${seconds} ${pluralize("second", seconds)}`;
  } else {
    return `${ms} ${pluralize("millisecond", ms)}`;
  }
}
