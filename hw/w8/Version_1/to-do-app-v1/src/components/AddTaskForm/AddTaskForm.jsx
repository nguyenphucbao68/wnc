import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { IoMdAddCircleOutline } from 'react-icons/io';

function AddTaskForm({ onAddItem }) {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newTask.trim() !== '') {
      onAddItem(newTask);
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
