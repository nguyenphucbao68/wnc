import React from 'react';
import { useContext } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { TaskContext } from '../../contexts/TaskProvider';

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
        style={{ marginRight: '4px' }}
        onClick={handleToggleComplete}
      />
      {task.title}
    </ListGroup.Item>
  );
}

export default TaskItem;
