// Search a string for set length character
const searchStr = (str, sub, searchLen) => {
  const ind = str.indexOf(sub);
  if (ind === -1) return [];
  const actInd = ind + sub.length;
  const next = searchStr(str.substring(actInd + searchLen), sub, searchLen);
  return [str.substring(actInd, actInd + searchLen), ...next].flat();
};

module.exports = {
  searchStr,
};
