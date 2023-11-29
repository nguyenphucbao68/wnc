import React, { useState, useEffect } from 'react';
import FilterTaskFrom from '../components/FilterTaskForm/FilterTaskFrom';
import AddTaskForm from '../components/AddTaskForm/AddTaskForm';
import TaskList from '../components/TaskList/TaskList';
import { Accordion } from 'react-bootstrap';

function TodoListPage() {
  const [todoList, setTodoList] = useState(() => {
    const storedTodoList = localStorage.getItem('todoList');

    if (storedTodoList) return JSON.parse(storedTodoList);
    else return [];
  });

  const [filteredList, setFilteredList] = useState([]);

  const onAddItem = (title) => {
    setTodoList([
      ...todoList,
      {
        id: todoList.length + 1,
        completed: false,
        title: title,
      },
    ]);
  };

  const onToggleComplete = (id) => {
    setTodoList(
      todoList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todoList));
    setFilteredList(todoList);
  }, [todoList]);

  const onFilterTasks = (value) => {
    if (value.trim() === '') {
      setFilteredList([...todoList]);
    } else {
      const filteredTasks = todoList.filter(({ title }) => {
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
      <AddTaskForm onAddItem={onAddItem} />
      <TaskList
        taskListItems={uncompletedTasks}
        onToggleComplete={onToggleComplete}
      />
      {completedTasks.length > 0 ? (
        <Accordion defaultActiveKey='0' className='mt-4'>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>Completed</Accordion.Header>
            <Accordion.Body>
              <TaskList
                taskListItems={completedTasks}
                onToggleComplete={onToggleComplete}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ) : null}
    </div>
  );
}

export default TodoListPage;
