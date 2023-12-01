import React, { useEffect } from 'react';
import FilterTaskFrom from '../components/FilterTaskForm/FilterTaskFrom';
import AddTaskForm from '../components/AddTaskForm/AddTaskForm';
import TaskList from '../components/TaskList/TaskList';
import { Accordion } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { TaskContext } from '../contexts/TaskProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function TodoApp() {
  const { tasks, dispatch } = useContext(TaskContext);
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    setTimeout(()=>
    fetch("http://localhost:3001/tasks")
    .then((rawData)=> rawData.json())
    .then((data)=>{
      dispatch({ type: 'INITIALIZE_TASKS', payload: data });
      setIsPending(false);
    }), 2000)
    
  }, [dispatch]);

  return (
    <div className='container'>
      {isPending && <div>Loading...</div>}
      {!isPending && tasks && (
      <div>
      <FilterTaskFrom />

      <AddTaskForm />

      <TaskList isCompleted={false}/>

      {tasks.some((item)=> item.completed) > 0 ? (
        <Accordion defaultActiveKey='0' className='mt-4'>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>Completed</Accordion.Header>
            <Accordion.Body>
              <TaskList isCompleted={true} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ) : null}
      </div>)}

    </div>
  );
}

export default TodoApp;
