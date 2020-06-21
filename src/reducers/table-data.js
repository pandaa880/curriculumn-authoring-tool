import {
  TRANSFORM,
  ADD,
  INDENT,
  OUTDENT,
  UPDATE_ROW_VALUE,
  DELETE,
  DROP,
} from "../constants/actions";

import {
  transformTreeToArr,
  getIdToIndexMapping,
  transformArrToTree,
} from "../utils/utils";

function updateLevel(type, arr, index) {
  if (type === INDENT) {
    for (let i = index + 1; i < arr.length; i++) {
      if (
        arr[i].parentId === arr[index].parentId ||
        arr[i].level <= arr[index].level
      ) {
        break;
      } else {
        arr[i].level += 1;
      }
    }

    return arr;
  }

  if (type === OUTDENT) {
    for (let i = index + 1; i < arr.length; i++) {
      if (
        arr[i].parentId === arr[index].parentId ||
        arr[i].level < arr[index].level
      ) {
        break;
      } else {
        let l = arr[i].level - 1;
        arr[i].level = l < 1 ? 1 : l;
      }
    }

    return arr;
  }

  if (type === DELETE) {
    let count = {
      start: index,
      end: index,
    };
    for (let i = index + 1; i < arr.length; i++) {
      if (
        arr[i].parentId === arr[index].parentId ||
        arr[i].level <= arr[index].level
      ) {
        break;
      } else {
        count.end += 1;
      }
    }

    arr.splice(count.start, count.end - count.start + 1);
    return arr;
  }
}

// tabledata reducer
export const tableDataReducer = (state, action) => {
  const { type, payload } = action;

  if (type === TRANSFORM) {
    const arr = transformTreeToArr(payload);
    const idMapping = getIdToIndexMapping(arr);
    let maxLevel = 1;
    const withLevels = arr.map((item) => {
      if (item.parentId === null) {
        item.level = 0;
      }
      const parent = arr[idMapping[item.parentId]];

      if (parent !== undefined) {
        item.level = parent.level + 1;

        if (item.level > maxLevel) {
          maxLevel = item.level;
        }
      }
      return item;
    });

    withLevels.forEach((item) => (item.maxLevel = maxLevel));

    return withLevels;
  }

  if (type === ADD) {
    const newData = [...state, payload];
    return newData;
  }

  if (type === INDENT) {
    const rowIndex = payload;
    const arr = [...state];
    const row = arr[rowIndex];
    const previousRow = rowIndex !== 1 && arr[rowIndex - 1];

    let updatedArr = [];

    if (row.level > previousRow.level) {
      return state;
    } else {
      let immediatePrevSibling;
      for (let i = rowIndex - 1; i >= 0; i--) {
        if (arr[rowIndex].parentId === arr[i].parentId) {
          immediatePrevSibling = arr[i];
          break;
        }
      }

      if (!immediatePrevSibling) {
        return arr;
      }
      updatedArr = updateLevel(INDENT, arr, rowIndex);
      row.parentId = immediatePrevSibling.id;
      row.level = immediatePrevSibling.level + 1;
    }

    updatedArr.splice(rowIndex, 1, row);
    return updatedArr;
  }

  if (type === OUTDENT) {
    const rowIndex = payload;
    const arr = [...state];
    const row = arr[rowIndex];
    // const previousRow = rowIndex !== 1 && arr[rowIndex - 1];

    const immediateParent = arr.find((item) => item.id === row.parentId);

    if (!immediateParent.level) {
      return arr;
    }

    const updatedArr = updateLevel(OUTDENT, arr, rowIndex);
    row.parentId = immediateParent.parentId;
    row.level = immediateParent.level;
    updatedArr.splice(rowIndex, 1, row);

    let r = transformArrToTree(updatedArr);
    let p = transformTreeToArr(r);
    return p;
  }

  if (type === UPDATE_ROW_VALUE) {
    const { value, index } = payload;
    const newArr = [...state];
    newArr[index].value = value;
    return newArr;
  }

  if (type === DELETE) {
    const newArr = [...state];

    const updatedArr = updateLevel(DELETE, newArr, payload);

    const tree = transformArrToTree(updatedArr);
    const arr = transformTreeToArr(tree);

    return arr;
  }

  if (type === DROP) {
    const arr = [...state];
    // console.log(payload);
    const { draggedItemIndex, dropTargetIndex } = payload;
    const dragged = arr[draggedItemIndex];
    const target = arr[dropTargetIndex];

    if (dragged.id === target.parentId) {
      return state;
    }

    dragged.parentId = target.id;

    arr.splice(draggedItemIndex, 1, dragged);

    const idMapping = getIdToIndexMapping(arr);
    const withLevels = arr.map((item) => {
      if (item.parentId === null) {
        item.level = 0;
      }
      const parent = arr[idMapping[item.parentId]];

      if (parent !== undefined) {
        item.level = parent.level + 1;
      }
      return item;
    });

    const tree = transformArrToTree([...withLevels]);
    const newArr = transformTreeToArr(tree);

    return newArr;
  }
  return state;
};
