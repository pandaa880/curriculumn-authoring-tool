/* eslint-disable */
import React, { useState, useReducer, useEffect } from "react";

// relative imports
import Table from "./Table";
import Button from "./Button";
import { transformArrToTree, transformTreeToArr } from "../utils/utils";
import {
  TRANSFORM,
  ADD,
  INDENT,
  OUTDENT,
  UPDATE_ROW_VALUE,
  DELETE,
  DROP,
} from "../constants/actions";
import { curriculumReducer } from "../reducers/curriculum";
import { tableDataReducer } from "../reducers/table-data";
// static data
import data from "../data.json";
// import { data as flatData } from "../data-flat";

function Node(value = "", parentId, level) {
  this.value = value;
  this.id = Number.parseInt(Math.random() * 1001) + Date.now();
  this.parentId = parentId;
  this.level = level;
  this.children = [];
}

function CurriculumTool() {
  const [curriculum, curriculumDispatch] = useReducer(
    curriculumReducer,
    new Node("", null, 0)
  );
  // const [curriculum, curriculumDispatch] = useReducer(curriculumReducer, data);
  const [tableData, tableDataDispatch] = useReducer(tableDataReducer, []);
  const [draggedItemIndex, setDraggedItem] = useState(null);
  const [dropTargetIndex, setDropTarget] = useState(null);

  // initialize curriculum

  // transform the data
  useEffect(() => {
    if (curriculum) {
      tableDataDispatch({ type: TRANSFORM, payload: curriculum });
    }
  }, [curriculum]);

  // add new data
  const addNewData = () => {
    const lastData = tableData[tableData.length - 1];
    tableDataDispatch({
      type: ADD,
      payload: new Node(
        "",
        lastData.parentId || lastData.id,
        lastData.level === 0 ? 1 : lastData.level
      ),
    });
  };

  // indent
  const indentRow = (index) => {
    tableDataDispatch({
      type: INDENT,
      payload: index,
    });
  };

  const outdentRow = (index) => {
    tableDataDispatch({
      type: OUTDENT,
      payload: index,
    });
  };

  const handleDragStart = (index) => {
    const currDragged = tableData[index];
    if (
      draggedItemIndex === null ||
      tableData[draggedItemIndex].id !== currDragged.id
    ) {
      setDraggedItem(index);
    }
  };

  const handleDragOver = (targetIndex) => {
    const currDragOver = tableData[targetIndex];
    const draggedItem = tableData[draggedItemIndex];
    if (draggedItem) {
      if (draggedItem.id === currDragOver.id) {
        return;
      }

      if (
        dropTargetIndex === null ||
        tableData[dropTargetIndex].id !== currDragOver.id
      ) {
        setDropTarget(targetIndex);
      }
    }
    return;
  };

  const handleDragEnd = () => {
    tableDataDispatch({
      type: DROP,
      payload: {
        draggedItemIndex,
        dropTargetIndex,
      },
    });
  };

  const handleInputChange = (value, index) => {
    tableDataDispatch({
      type: UPDATE_ROW_VALUE,
      payload: {
        value,
        index,
      },
    });
  };

  const handleRowDelete = (index) => {
    tableDataDispatch({
      type: DELETE,
      payload: index,
    });
  };

  // import export
  const onReaderLoad = (e) => {
    const json = JSON.parse(e.target.result);

    curriculumDispatch({
      type: TRANSFORM,
      payload: json,
    });
    return json;
  };
  const importData = (e) => {
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(e.target.files[0]);
  };
  const exportData = () => {
    if (tableData.length > 1) {
      const treeData = transformArrToTree(tableData);
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(treeData)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "curriculumn.json";

      link.click();
    }
  };

  return (
    <section className="main">
      <header>
        <h1 className="section-title">Mathematics</h1>
        <div className="import-export-btn__container">
          {/* <Button type="button" className="btn--import">
            Import
          </Button> */}
          <input
            type="file"
            accept="application/JSON"
            name="import-file"
            onChange={importData}
            placeholder="Import JSON data"
          />
          <Button type="button" className="btn--export" onClick={exportData}>
            Export
          </Button>
        </div>
      </header>
      <Table
        tableData={tableData}
        addNewData={addNewData}
        indentRow={indentRow}
        outdentRow={outdentRow}
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
        handleDragOver={handleDragOver}
        handleInputChange={handleInputChange}
        handleRowDelete={handleRowDelete}
      />
    </section>
  );
}

export default CurriculumTool;
