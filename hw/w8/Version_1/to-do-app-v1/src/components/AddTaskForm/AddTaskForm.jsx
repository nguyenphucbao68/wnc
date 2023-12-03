import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { IoMdAddCircleOutline } from 'react-icons/io';

function AddTaskForm({ onAddItem }) {
  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = formRef.current.value;
    if (newTask.trim() !== '') {
      onAddItem(newTask);
      formRef.current.value = '';
    }
  };

  return (
    <Form onSubmit={handleSubmit} className='d-flex flex-column gap-2'>
      <Form.Group controlId='addTask'>
        <Form.Control
          type='text'
          ref={formRef}
          placeholder='Add a task'
          size='sm'
        />
      </Form.Group>
      <Button
        variant='primary'
        size='sm'
        type='submit'
        className='align-self-end'
      >
        Add
        <IoMdAddCircleOutline className='ms-2' />
      </Button>
    </Form>
  );
}

export default AddTaskForm;
