# Homework 8: TodoApp with ReactJS

This document provides detailed guidelines for building a simple task management application (TodoApp) using React and React Bootstrap. The application will consist of a single view/screen with three components: TaskList, AddTask, and FilterTask. The tasks will be managed in-memory or using local storage for simplicity.

# Requirements:

👉 Students make a simple task management application (todoApp) from scratch that provides some following features in only 01 view/screen

- Show all tasks
- Add new task
- Mark a task as a completed task. Comleted task(s) should have different style from incomplete task(s)
- Filter some tasks by their title/name

## Version 1:

👉 todoApp main view should be a combination of at least 3 components: taskList, addTask, filterTask, ...
👉 NO backend required, tasks data can be setup inside your source code, or can be read/written from localStorage

## Version 2:

👉 Apply one-way data flow architecture into todoApp, no props probagation required any more using useContext and useReducer, or using redux

# TodoApp Version 1

## Prerequisites

Make sure you have Node.js and npm installed on your machine.

- [NodeJS](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

## Setup

1. Create a new React app using [Create React App](https://create-react-app.dev/):

```bash
npx create-react-app to-do-app-v1
cd to-do-app-v1
```

2. Install React Bootstrap:

```bash
npm install react-bootstrap bootstrap
```

Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't ship with any included CSS. However, some stylesheet is required to use these components. Please import this into `App.js` file:

```bash
import 'bootstrap/dist/css/bootstrap.min.css';
```

3. Start the development server:

```
npm start
```

Visit http://localhost:3000 to view the TodoApp in your browser.

## Components Implementation

In the `src` folder of our project, we create 2 folders named `components` and `pages`

- `components`: store all components for resusability
- `pages`: store a page by combining one or multiple components

### Creating the TaskListItem component

The `TaskListItem` component is responsible for rendering individual tasks. Each task is presented with a title and a button, allowing users to mark the task as completed by clicking the button.

Task has a completion status that can be toggled. Completed task has a different style from incomplete tasks. This interactive feature provides a user-friendly way to manage and track the progress of tasks within the application

Create the folder `TaskListItem` in `components` folder. Then create file `TaskListItem.jsx`

```jsx
// TaskListItem.jsx

import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

function TaskListItem(props) {
  const { task } = props;
  return (
    <ListGroup.Item action variant={task.completed ? 'success' : 'primary'}>
      <Button
        variant={task.completed ? 'success' : 'outline-success'}
        style={{ marginRight: '4px' }}
      />
      {task.title}
    </ListGroup.Item>
  );
}

export default TaskListItem;
```

`TaskListItem` receives props representing the task item, which is then rendered within itself.

### Creating the TaskList component

The TaskList component displays a list of tasks.

Create the folder `TaskList` in `components` folder. Then create file `TaskList.jsx`

```jsx
// TaskList.jsx

import React from 'react';
import { ListGroup } from 'react-bootstrap';
import TaskItem from '../TaskItem/TaskItem';

function TaskList(props) {
  return (
    <ListGroup>
      {props.taskListItems.map(({ id, completed, title }) => (
        <TaskItem key={id} task={{ id, completed, title }} />
      ))}
    </ListGroup>
  );
}

export default TaskList;
```

### Creating the AddTaskForm component

The `AddTaskForm` component allows users to add new tasks. Enter the task title and click the `Add` button or press Enter to add a new task to the list

Create the folder `AddTaskForm` in `components` folder. Then create file `AddTaskForm.jsx`

```jsx
// AddTaskForm.jsx

import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';

function AddTaskForm(props) {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newTask.trim() !== '') {
      setNewTask('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='addTask' style={{ padding: '10px' }}>
        <Form.Control
          type='text'
          placeholder='Add a task'
          size='sm'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <div
          style={{
            width: '100%',
            backgroundColor: '#faf9f8',
            padding: '5px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant='primary' size='sm' type='submit'>
            Add
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
}

export default AddTaskForm;
```

The `useState` hook is used to create a state variable newTask to manage the input of a new task in the form.

The `handleSubmit` function is called when the form is submitted. It prevents the default form submission behavior and checks if the newTask is not an empty string before calling the onAddItem function passed as a prop. After adding the task, the newTask state is cleared.

The component receives onAddItem as a prop, which is a function responsible for adding a new task to the overall task list.

### Creating the FilterTask component

The `FilterTask` component enables users to filter tasks based on their title. Enter text in the input field to filter tasks dynamically.

Create the folder `FilterTask` in `components` folder. Then create file `FilterTask.jsx`

```jsx
// FilterTask.jsx

import React, { useState } from 'react';

import { Form } from 'react-bootstrap';

function FilterTaskFrom(props) {
  const [filterTasks, setFilterTasks] = useState('');

  return (
    <Form.Control
      type='text'
      id='filterTasks'
      size='sm'
      value={filterTasks}
      onChange={(e) => setFilterTasks(e.target.value)}
    />
  );
}

export default FilterTaskFrom;
```

## Application Implementation

After the successful creation of individual components, it's time to seamlessly integrate them to form a cohesive page for efficiently managing your todo list. This integration involves orchestrating the collaboration between components, allowing for a unified user experience where users can effortlessly add, filter, and interact with tasks in a streamlined manner.

```jsx
// App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import AddTaskForm from './components/AddTaskForm/AddTaskForm';
import TaskListItem from './components/TaskListItem/TaskListItem';
import FilterTaskFrom from './components/FilterTaskForm/FilterTaskFrom';

function App() {
  return (
    <div
      style={{
        width: '70%',
        margin: 'auto',
        backgroundColor: 'gray',
      }}
    >
      <FilterTaskFrom />
      <AddTaskForm />
      <TaskList />
    </div>
  );
}

export default App;
```

While the components currently render on the screen, they lack interactivity due to the absence of essential logic. To address this, we'll imbue each component with the necessary logic to seamlessly interact with one another. This integration will empower users to efficiently manage tasks by enabling functionalities such as adding new tasks, filtering tasks, and marking tasks as completed or undone.

### Managing TodoList with useState

To facilitate the dynamic management of the todo list, we'll leverage the useState hook. This allows us to effortlessly add and interact with each task within the application.

In App.js, initialize the state for the todo list:

```jsx
// App.jsx

// ... remaining code
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

  return (
    // remaining code
    <TaskList taskListItems={todoList} />
  );
}

export default App;
```

Next, create a function to add a new task to the todo list. Implement the onAddItem function within App::

```jsx
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
```

With this setup, the todo list is now seamlessly managed through state, and the onAddItem function enables the addition of new tasks with ease

### Creating a handle for AddTask logic

In the `AddTaskForm` component, we establish a logic for adding tasks by incorporating the onAddItem function as a prop. This function is triggered whenever a user adds a new task, seamlessly updating the todoList.

```jsx
// AddTaskForm.jsx

import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';

function AddTaskForm(props) {
  const { onAddItem } = props; // add this
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newTask.trim() !== '') {
      onAddItem(newTask); // add this
      setNewTask('');
    }
  };

  return (
   // remaining code...
  );
}

export default AddTaskForm;
```

In this implementation, the onAddItem function is seamlessly integrated, ensuring that when a user submits a new task, the associated logic efficiently adds it to the todoList. This enhances the user experience by providing a responsive and intuitive way to contribute tasks to the overall list.

Don't forget to pass `onAddItem` function in `App` to `AddTaskForm` component

```jsx
// App.js

// import dependencies

function App() {
  const [todoList, setTodoList] = useState([]);

  const onAddItem = (title) => {
    // remaining code ...
  };

  return (
    // remaining code ...
    <AddTaskForm onAddItem={onAddItem} />
    <TaskList taskListItems={todoList}/>

    // remaining code ...
  );
}

export default App;
```

### Creating a handle for mark tasks complete

We need to implement the `onToggleComplete` to handle mark task complete or unmark it back.

```jsx
// App.js
// import dependencies

function App() {
  // remaining code ...
  const onToggleComplete = (id) => {
    setTodoList(
      todoList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    // remaining code ...
    <TaskList taskListItems={todoList} onToggleComplete={onToggleComplete} />
    // remaining code ...
  );
}

export default App;
```

In `TaskItem`, add logic for toggleComplete whenever user click the button to mark completed

```jsx
// TaskItem.jsx

function TaskItem({ task, onToggleComplete }) {
  // add this
  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  return (
    // remaining code ...
    <Button
      onClick={handleToggleComplete} // add this
    />
    // remaining code ...
  );
}

export default TaskItem;
```

Don't forget to pass the function props from `TaskList` to `TaskItem`

```jsx
// TaskList.jsx

function TaskList(props) {
  return (
    <ListGroup>
      {props.taskListItems.map(({ id, completed, title }) => (
        <TaskItem
          // Don't forget to add this
          onToggleComplete={props.onToggleComplete}
        />
      ))}
    </ListGroup>
  );
}
```

To streamline the organization of completed and uncompleted tasks, we can refine the code for improved readability and styling. By separating the tasks into two distinct categories and applying different styles, we enhance the user experience.

```jsx
// App.js

function App() {
  const [todoList, setTodoList] = useState([]);

  // remaining code  ...

  const uncompletedTasks = todoList.filter(({ completed }) => !completed);
  const completedTasks = todoList.filter(({ completed }) => completed);

  return (
    <div
      style={{
        width: '70%',
        margin: 'auto',
        backgroundColor: 'gray',
      }}
    >
      <TaskList
        taskListItems={uncompletedTasks}
        onToggleComplete={onToggleComplete}
      />
      <TaskList
        taskListItems={completedTasks}
        onToggleComplete={onToggleComplete}
      />
    </div>
  );
}
```

We create 2 list for handle complete and uncomplete tasks, the create another TaskList component to display them. We can group completed tasks in Accordion and just show them when there is at least 1 completed task by conditional rendering

```jsx
// App.js

function App() {
  const [todoList, setTodoList] = useState([]);

  // remaining code ...
  const completedTasks = filteredTasks.filter(({ completed }) => completed);

  return (
    // remaining code ...
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
    // remaining code ...
  );
}
```

### Filtering tasks feature

To implement the task filtering feature, create a new state, filteredList, to store tasks based on user input in the search bar. The logic for filtering tasks is then developed.

```jsx
// App.js

function App() {
  const [todoList, setTodoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  // remaining code ...

  useEffect(() => {
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
      // remaining code...
    </div>
  );
}

export default App;
```

In the `FilterTaskForm` component, the `useEffect` hook is applied to track changes in the text input for task filtering:

```jsx
// FilterTaskForm.jsx
function FilterTaskFrom({ onFilterTasks }) {
  const [filterTasks, setFilterTasks] = useState('');

  useEffect(() => {
    onFilterTasks(filterTasks);
  }, [filterTasks]);

  return (
    <Form.Control
      type='text'
      id='filterTasks'
      size='sm'
      value={filterTasks}
      onChange={(e) => setFilterTasks(e.target.value)}
    />
  );
}

export default FilterTaskFrom;
```

### Store data in localStorage
To ensure persistent data storage and retrieval, the application utilizes the local storage mechanism. Whenever a task's status is updated or a new task is created, the corresponding changes are reflected in the local storage. Additionally, upon the initial loading of the application, the todo list is retrieved from local storage and stored in the todoList state.
```jsx

function App() {
  // Read localStorage and store it when state is init
  const [todoList, setTodoList] = useState(() => {
    const storedTodoList = localStorage.getItem('todoList');

    if (storedTodoList) return JSON.parse(storedTodoList);
    else return [];
  });

  useEffect(() => {
    // Whenever todoList is updated, store it also in localStorage
    localStorage.setItem('todoList', JSON.stringify(todoList));
    setFilteredList(todoList);
  }, [todoList]);


  // rest of the code
}

export default App;
```

This code snippet showcases the seamless integration of local storage with the application's state. The useState hook is employed to initialize the todoList state with data from local storage during the app's initialization. Subsequently, the useEffect hook ensures that any updates to the todoList are consistently mirrored in the local storage, thereby maintaining the integrity of the application's data.

## Conclusion
In this Version 1 of the Todo App, we've successfully addressed the need to persistently store and retrieve data using local storage. However, we've identified a limitation in the approach of passing props from the App component to TaskList and then to ItemList for updates. To overcome this, Version 2 will explore the implementation of State Global Management for a more efficient and scalable solution.

# Version 2