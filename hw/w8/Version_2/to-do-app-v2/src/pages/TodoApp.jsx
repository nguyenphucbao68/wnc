import React, { useState, useEffect } from 'react';
import FilterTaskFrom from '../components/FilterTaskForm/FilterTaskFrom';
import AddTaskForm from '../components/AddTaskForm/AddTaskForm';
import TaskList from '../components/TaskList/TaskList';
import { Accordion } from 'react-bootstrap';
import { useContext } from 'react';
import { TaskContext } from '../contexts/TodoListProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function TodoApp() {
  const { tasks, dispatch } = useContext(TaskContext);

  const [filteredList, setFilteredList] = useState([...tasks]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('todo'));
    if (storedTasks) {
      dispatch({ type: 'INITIALIZE_TASKS', payload: storedTasks });
    }
  }, [dispatch]);

  useEffect(() => {
    setFilteredList([...tasks]);
    localStorage.setItem('todo', JSON.stringify(tasks));
  }, [tasks]);

  const onFilterTasks = (value) => {
    if (value.trim() === '') {
      setFilteredList([...tasks]);
    } else {
      const filteredTasks = tasks.filter(({ title }) => {
        return title.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredList(filteredTasks);
    }
  };

  const uncompletedTasks = filteredList.filter(({ completed }) => !completed);
  const completedTasks = filteredList.filter(({ completed }) => completed);

  return (
    <div
      style={{
        width: '70%',
        margin: 'auto',
        backgroundColor: 'gray',
      }}
    >
      <FilterTaskFrom onFilterTasks={onFilterTasks} />
      <AddTaskForm />
      <TaskList taskListItems={uncompletedTasks} />
      {completedTasks.length > 0 ? (
        <Accordion defaultActiveKey='0' className='mt-4'>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>Completed</Accordion.Header>
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
