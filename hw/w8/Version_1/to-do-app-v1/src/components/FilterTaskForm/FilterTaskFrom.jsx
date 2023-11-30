import React from "react";

import { Form } from "react-bootstrap";

function FilterTaskFrom({ onFilterTasks }) {
  return (
    <Form.Control
      className="my-3"
      type="text"
      placeholder="Search tasks"
      id="filterTasks"
      size="sm"
      onChange={(e) => onFilterTasks(e.target.value)}
    ></Form.Control>
  );
}

export default FilterTaskFrom;
