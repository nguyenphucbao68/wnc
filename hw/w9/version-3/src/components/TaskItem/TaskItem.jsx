import React, { useState } from 'react';
import { useContext } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { TaskContext } from '../../contexts/TaskProvider';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function TaskItem({ task }) {
  const { dispatch } = useContext(TaskContext);
  const [isPending, setIsPending] = useState(false);

  const handleToggleComplete = () => {
    task.completed = !task.completed
    setIsPending(true);

    setTimeout(()=>
    fetch(`http://localhost:3001/tasks/${task.id}`,{
      method: 'PUT',
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
        type: 'TOGGLE_TASK',
        payload: data,
      });
      setIsPending(false);
    }), 2000);
  };

  return (
    <ListGroup.Item variant={task.completed ? 'success' : 'primary'}>
      <Button
        variant={task.completed ? 'success' : 'outline-success'}
        onClick={handleToggleComplete}
        className="mr-2"
        disabled={isPending}
      >
        {isPending && <AiOutlineLoading3Quarters/> }
        {!isPending && (task.completed ? <IoMdRemove /> : <IoMdAdd />)}
      </Button>
      <span>{task.completed ? <del>{task.title}</del> : task.title}</span>
    </ListGroup.Item>
  );
}

export default TaskItem;
