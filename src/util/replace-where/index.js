export default function replaceWhere(arr, pred, trans) {
  return arr.map((v, i, a) => pred(v, i, a) ? trans(v, i, a) : v);
}
