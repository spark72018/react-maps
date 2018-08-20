export function arraysEqualByProperty(property, arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (var i = arr1.length; i--; ) {
    if (arr1[i][property] !== arr2[i][property]) return false;
  }

  return true;
}
