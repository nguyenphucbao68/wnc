import React from "react";
import { ListGroup } from "react-bootstrap";
import TaskItem from "../TaskItem/TaskItem";
import { useContext } from "react";
import { TaskContext } from "../../contexts/TaskProvider";

function TaskList({ isCompleted }) {
  const { tasks, filterKey } = useContext(TaskContext);
  const trimFilterKey = filterKey.trim();
  return (
    <ListGroup>
      {tasks.map(
        ({ id, completed, title }) =>
          completed === isCompleted && // separate completed and not completed logic
          (trimFilterKey === '' || title.toLowerCase().includes(trimFilterKey.toLowerCase())) && //filter logic
          (
            <TaskItem key={id} task={{ id, completed, title }} />
          )
      )}
    </ListGroup>
  );
}

export default TaskList;
