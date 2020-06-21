/* eslint-disable */
import React, { useState, useReducer, useEffect } from "react";

// relative imports
import Table from "./Table";
import { transformArrToTree, transformTreeToArr } from "../utils/utils";
import {
  TRANSFORM,
  ADD,
  INDENT,
  OUTDENT,
  UPDATE_ROW_VALUE,
  DELETE,
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
  // const [curriculum, curriculumDispatch] = useReducer(curriculumReducer, data);
  const [curriculum, curriculumDispatch] = useReducer(
    curriculumReducer,
    new Node("", null, 0)
  );
  const [tableData, tableDataDispatch] = useReducer(tableDataReducer, []);

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

  const handleDrag = (e) => {
    console.log(e.type);
  };

  const handleDragOver = (e) => {
    console.log("Drag over");
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

  return (
    <section className="main">
      <h1>Mathematics</h1>
      <Table
        tableData={tableData}
        addNewData={addNewData}
        indentRow={indentRow}
        outdentRow={outdentRow}
        handleDrag={handleDrag}
        handleDragOver={handleDragOver}
        handleInputChange={handleInputChange}
        handleRowDelete={handleRowDelete}
      />
    </section>
  );
}

export default CurriculumTool;
