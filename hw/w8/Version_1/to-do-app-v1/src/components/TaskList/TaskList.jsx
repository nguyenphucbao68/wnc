import React from 'react';
import { ListGroup } from 'react-bootstrap';
import TaskItem from '../TaskItem/TaskItem';

function TaskList(props) {
  return (
    <ListGroup>
      {props.taskListItems.map(({ id, completed, title }) => (
        <TaskItem
          key={id}
          task={{ id, completed, title }}
          onToggleComplete={props.onToggleComplete}
        />
      ))}
    </ListGroup>
  );
}

export default TaskList;
