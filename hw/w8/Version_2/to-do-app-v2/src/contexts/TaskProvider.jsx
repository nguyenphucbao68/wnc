import React, { useReducer, createContext } from 'react';

export const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTasks = [
        ...state.currentTasks,
        {
          id: Date.now(),
          title: action.payload,
          completed: false,
        },
      ];
      localStorage.setItem('todo-v2', JSON.stringify(newTasks));
      return {
        filteredTasks: newTasks,
        currentTasks: newTasks,
      };
    }

    case 'TOGGLE_TASK': {
      const newTasks = state.currentTasks.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
      const newFilteredTasks = state.filteredTasks.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
      localStorage.setItem('todo-v2', JSON.stringify(newFilteredTasks));
      return {
        filteredTasks: newFilteredTasks,
        currentTasks: newTasks,
      };
    }

    case 'FILTER_TASK': {
      return {
        ...state,
        filteredTasks: action.payload,
      };
    }

    case 'INITIALIZE_TASKS': {
      return {
        filteredTasks: action.payload,
        currentTasks: action.payload,
      };
    }

    default:
      return state;
  }
};

const initialTasks = {
  currentTasks: [],
  filteredTasks: [],
};

export const TaskProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  return (
    <TaskContext.Provider value={{ tasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
