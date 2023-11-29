import React, {useReducer, createContext} from 'react';

export const TaskContext = createContext();

const taskReducer = (state, action) => {
  console.log({ state, action });
  switch (action.type) {
    case 'ADD_TASK': {
      return [
        ...state,
        {
          id: Date.now(),
          title: action.payload,
          completed: false,
        },
      ];
    }

    case 'TOGGLE_TASK': {
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
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
