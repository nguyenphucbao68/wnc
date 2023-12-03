import React, { useEffect } from 'react';
import FilterTaskFrom from '../components/FilterTaskForm/FilterTaskForm';
import AddTaskForm from '../components/AddTaskForm/AddTaskForm';
import TaskList from '../components/TaskList/TaskList';
import { Accordion } from 'react-bootstrap';
import { useContext } from 'react';
import { TaskContext } from '../contexts/TaskProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function TodoApp() {
  const { tasks, dispatch } = useContext(TaskContext);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('todo-v2'));
    if (storedTasks) {
      dispatch({ type: 'INITIALIZE_TASKS', payload: storedTasks });
    }
  }, [dispatch]);

  const uncompletedTasks = tasks.filteredTasks.filter(
    ({ completed }) => !completed
  );
  const completedTasks = tasks.filteredTasks.filter(
    ({ completed }) => completed
  );

  return (
    <div className='container'>
      <FilterTaskFrom />
      <AddTaskForm />
      {uncompletedTasks.length > 0 && <p class='h2'>Uncompleted Tasks</p>}
      <TaskList taskListItems={uncompletedTasks} />
      {completedTasks.length > 0 ? (
        <Accordion defaultActiveKey='0' className='mt-4'>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>
              <b>Completed</b>
            </Accordion.Header>
            <Accordion.Body>
              <TaskList taskListItems={completedTasks} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ) : null}
    </div>
  );
}

export default TodoApp;
