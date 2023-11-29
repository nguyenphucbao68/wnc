import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import { TaskContext } from '../../contexts/TaskProvider';

function AddTaskForm() {
  const [newTask, setNewTask] = useState('');
  const { dispatch } = useContext(TaskContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newTask.trim() !== '') {
      dispatch({
        type: 'ADD_TASK',
        payload: newTask,
      });
      setNewTask('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='addTask' style={{ padding: '10px' }}>
        <Form.Control
          type='text'
          placeholder='Add a task'
          size='sm'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <div
          style={{
            width: '100%',
            backgroundColor: '#faf9f8',
            padding: '5px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant='primary' size='sm' type='submit'>
            Add
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
}

export default AddTaskForm;
