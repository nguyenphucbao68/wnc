import React from 'react';
import { useContext } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { TaskContext } from '../../contexts/TaskProvider';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';

function TaskItem({ task }) {
  const { dispatch } = useContext(TaskContext);

  const handleToggleComplete = () => {
    dispatch({
      type: 'TOGGLE_TASK',
      payload: task.id,
    });
  };

  return (
    <ListGroup.Item action variant={task.completed ? 'success' : 'primary'}>
      <Button
        variant={task.completed ? 'success' : 'outline-success'}
        onClick={handleToggleComplete}
        className='me-2'
      >
        {task.completed ? <IoMdRemove /> : <IoMdAdd />}
      </Button>
      <span>{task.completed ? <del>{task.title}</del> : task.title}</span>
    </ListGroup.Item>
  );
}

export default TaskItem;
