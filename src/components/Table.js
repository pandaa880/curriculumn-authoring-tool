import React from "react";

import Button from "./Button";

function Table({
  tableData,
  addNewData,
  indentRow,
  outdentRow,
  handleDrag,
  handleDragOver,
  handleInputChange,
  handleRowDelete,
}) {
  const _renderTableRow = (arr) => {
    return arr.map(
      (item, index) =>
        item.parentId && (
          <tr
            key={index}
            draggable="true"
            onDragStart={handleDrag}
            onDragEnd={handleDrag}
          >
            <td className="action-btn-cell">
              <div className="action-btn-group">
                <Button>Move</Button>
                <Button
                  onClick={() => outdentRow(index)}
                  // disabled={item.level === 1}
                >
                  Outdent
                </Button>
                <Button
                  onClick={() => indentRow(index)}
                  // disabled={item.level === item.maxLevel}
                >
                  Indent
                </Button>
                <Button onClick={() => handleRowDelete(index)}>Delete</Button>
              </div>
            </td>
            <td
              className="value-cell"
              style={{ paddingLeft: `${item.level}rem` }}
            >
              <div className="input-container">
                <input
                  type="text"
                  name="topic"
                  className="input"
                  value={item.value}
                  onChange={(e) => {
                    handleInputChange(e.target.value, index);
                  }}
                />
              </div>
            </td>
          </tr>
        )
    );
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Actions</th>
            <th>Standards</th>
          </tr>
        </thead>
        <tbody onDragOver={handleDragOver}>{_renderTableRow(tableData)}</tbody>
      </table>
      <Button onClick={addNewData}>Add New</Button>
    </div>
  );
}

export default Table;
