import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useContext } from 'react';
import { TaskContext } from '../../contexts/TaskProvider';
import { IoMdAddCircleOutline } from 'react-icons/io';

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
    <Form onSubmit={handleSubmit} className='d-flex flex-column gap-2'>
      <Form.Group controlId='addTask'>
        <Form.Control
          type='text'
          placeholder='Add a task'
          size='sm'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
      </Form.Group>
      <Button
        variant='primary'
        size='sm'
        type='submit'
        className='align-self-end'
      >
        Add
        <IoMdAddCircleOutline />
      </Button>
    </Form>
  );
}

export default AddTaskForm;
