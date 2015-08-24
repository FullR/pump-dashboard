export default function jsonDownloadURL(source={}, tabSize=2) {
  return `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(source, null, tabSize))}`;
}
