export const getIdToIndexMapping = (arr) => {
  return arr.reduce((acc, curr, i) => {
    acc[curr.id] = i;
    return acc;
  }, {});
};

export const transformArrToTree = (d) => {
  const arr = [...d];
  const idMapping = getIdToIndexMapping(arr);
  let root;

  arr.forEach((item) => {
    if (item.parentId === null) {
      root = item;
      return;
    }

    // find the index of parent and using that index find the parent node
    const parentEl = arr[idMapping[item.parentId]];

    parentEl.children = [...(parentEl.children || []), item];
  });
  return root;
};

export const transformTreeToArr = ({ children, ...rest }) => {
  return [rest, ...(children?.flatMap(transformTreeToArr) ?? [])];
};
