import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useContext } from 'react';
import { TaskContext } from '../../contexts/TaskProvider';
import { IoMdAddCircleOutline } from 'react-icons/io';

function AddTaskForm() {
  const formRef = useRef();
  const { dispatch } = useContext(TaskContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = formRef.current.value;
    if (newTask.trim() !== '') {
      dispatch({
        type: 'ADD_TASK',
        payload: newTask,
      });
      
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
