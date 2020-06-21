import React from "react";

import Button from "./Button";
import {
  move as MoveIcon,
  outdent as OutdentIcon,
  indent as IndentIcon,
  deleteIcon as DeleteIcon,
} from "../icons";

function Table({
  tableData,
  addNewData,
  indentRow,
  outdentRow,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleInputChange,
  handleRowDelete,
}) {
  const onDragStart = (e, rowDetails, index) => {
    const row = document.querySelector(`.table-row-${rowDetails.id}`);
    e.dataTransfer.effectAllowed = "move";
    // e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setData("text/html", row);
    e.dataTransfer.setDragImage(row, 20, 20);
    handleDragStart(index);
  };

  const onDragOver = (e, index) => {
    // console.log(e.target, index);
    handleDragOver(index);
  };

  const onDragEnd = () => {
    handleDragEnd();
  };
  const _renderTableRow = (arr) => {
    return arr.map(
      (item, index) =>
        item.parentId && (
          <tr
            key={index}
            className={`table-row table-row-${item.id}`}
            onDragOver={(e) => onDragOver(e, index)}
          >
            <td className="action-btn-cell">
              <div className="action-btn-group">
                <Button
                  draggable
                  className="action-btn drag"
                  onDragStart={(e) => onDragStart(e, item, index)}
                  onDragEnd={() => onDragEnd(index)}
                >
                  <MoveIcon />
                </Button>
                <Button
                  onClick={() => outdentRow(index)}
                  // disabled={item.level === 1}
                  className="action-btn"
                >
                  <OutdentIcon />
                </Button>
                <Button
                  onClick={() => indentRow(index)}
                  // disabled={item.level === item.maxLevel}
                  className="action-btn"
                >
                  <IndentIcon />
                </Button>
                <Button
                  className="action-btn"
                  onClick={() => handleRowDelete(index)}
                >
                  <DeleteIcon />
                </Button>
              </div>
            </td>
            <td
              className="value-cell"
              style={{ paddingLeft: `${item.level}rem` }}
            >
              <div className="input-container">
                <span className="input-container__block"></span>
                <input
                  type="text"
                  name="topic"
                  className="input"
                  value={item.value}
                  onChange={(e) => {
                    handleInputChange(e.target.value, index);
                  }}
                  placeholder="Type standard here (e.g Numbers)"
                />
              </div>
            </td>
          </tr>
        )
    );
  };

  return (
    <div className="table-form__container">
      <table>
        <thead>
          <tr>
            <th>
              Actions
              <span>
                Move, Indent, <br />
                Outdent, Delete
              </span>
            </th>
            <th>
              Standards
              <span>The text of the standard</span>
            </th>
          </tr>
        </thead>
        <tbody>{_renderTableRow(tableData)}</tbody>
      </table>
      <Button onClick={addNewData} className="action-btn--submit">
        + Add New
      </Button>
    </div>
  );
}

export default Table;
