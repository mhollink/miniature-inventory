export function moveItem(array: string[], fromIndex: number, toIndex: number) {
  const [item] = array.splice(fromIndex, 1);
  array.splice(toIndex, 0, item);
  return array;
}

export function moveItemBetweenLists(
  array1: string[],
  fromIndex: number,
  array2: string[],
  toIndex: number,
) {
  const [item] = array1.splice(fromIndex, 1);
  array2.splice(toIndex, 0, item);
  return [array1, array2];
}
