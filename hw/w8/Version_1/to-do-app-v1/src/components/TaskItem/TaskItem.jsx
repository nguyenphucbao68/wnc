import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';

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
        className='mr-2'
      >
        {task.completed ? <IoMdRemove /> : <IoMdAdd />}
      </Button>
      <span>{task.title}</span>
    </ListGroup.Item>
  );
}

export default TaskItem;
