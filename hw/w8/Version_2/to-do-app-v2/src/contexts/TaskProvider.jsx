import React, { useReducer, createContext } from 'react';

export const TaskContext = createContext();

const taskReducer = (state, action) => {
  console.log({ state, action });
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask = [
        ...state,
        {
          id: Date.now(),
          title: action.payload,
          completed: false,
        },
      ];
      localStorage.setItem('todo', JSON.stringify(newTask));
      return newTask;
    }

    case 'TOGGLE_TASK': {
      const newTasks = state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
      localStorage.setItem('todo', JSON.stringify(newTasks));
      return newTasks;
    }

    case 'INITIALIZE_TASKS': {
      return [...action.payload];
    }

    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
