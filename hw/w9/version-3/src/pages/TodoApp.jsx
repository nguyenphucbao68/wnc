import React, { useEffect } from 'react';
import FilterTaskFrom from '../components/FilterTaskForm/FilterTaskFrom';
import AddTaskForm from '../components/AddTaskForm/AddTaskForm';
import TaskList from '../components/TaskList/TaskList';
import { Accordion } from 'react-bootstrap';
import { useContext } from 'react';
import { TaskContext } from '../contexts/TaskProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function TodoApp() {
  const { tasks, dispatch } = useContext(TaskContext);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('todo'));
    if (storedTasks) {
      dispatch({ type: 'INITIALIZE_TASKS', payload: storedTasks });
    }
  }, [dispatch]);

  return (
    <div className='container'>
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

    </div>
  );
}

export default TodoApp;
