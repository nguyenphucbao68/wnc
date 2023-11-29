import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

function TaskItem({ task, onToggleComplete }) {
  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  return (
    <ListGroup.Item action variant={task.completed ? 'success' : 'primary'}>
      <Button
        variant={task.completed ? 'success' : 'outline-success'}
        style={{ marginRight: '4px' }}
        onClick={handleToggleComplete}
      />
      {task.title}
    </ListGroup.Item>
  );
}

export default TaskItem;
