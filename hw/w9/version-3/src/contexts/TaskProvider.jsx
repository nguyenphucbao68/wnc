import React, { useReducer, createContext, useState } from 'react';

export const TaskContext = createContext();

const taskReducer = (state, action) => {
  console.log({ state, action });
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask = [
        ...state, action.payload
      ];
      return newTask;
    }

    case 'TOGGLE_TASK': {
      const newTasks = state.map((task) =>
        task.id === action.payload.id
          ? action.payload
          : task
      );
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
  const [filterKey, setFilterKey] = useState('')

  return (
    <TaskContext.Provider value={{ tasks, dispatch, filterKey, setFilterKey}}>
      {children}
    </TaskContext.Provider>
  );
};
