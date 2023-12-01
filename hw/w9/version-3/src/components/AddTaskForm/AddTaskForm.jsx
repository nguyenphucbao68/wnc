import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useContext } from 'react';
import { TaskContext } from '../../contexts/TaskProvider';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function AddTaskForm() {
  const [newTask, setNewTask] = useState('');
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useContext(TaskContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newTask.trim() !== '') {
      const task = {
        title: newTask,
        completed: false
      }
      setIsPending(true);

      setTimeout(()=>
    fetch(`http://localhost:3001/tasks`,{
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(task)
    })
    .then((response)=>{
      if(!response.ok)
        throw Error('Error');
      return response.json();
    })
    .then((data)=>{
      dispatch({
        type: 'ADD_TASK',
        payload: data,
      });
      setNewTask('');
      setIsPending(false);
    }), 2000);
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
        disabled={isPending}
      >
        Add
        {isPending? <AiOutlineLoading3Quarters /> :<IoMdAddCircleOutline />}
      </Button>
    </Form>
  );
}

export default AddTaskForm;
