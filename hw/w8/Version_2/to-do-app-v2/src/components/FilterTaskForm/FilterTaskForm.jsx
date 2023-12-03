import React, { useContext } from 'react';

import { Form } from 'react-bootstrap';
import { TaskContext } from '../../contexts/TaskProvider';

function FilterTaskFrom() {
  const { tasks, dispatch } = useContext(TaskContext);

  const onFilterTasks = (value) => {
    dispatch({
      type: 'FILTER_TASK',
      payload:
        value.trim() === ''
          ? tasks.currentTasks
          : tasks.currentTasks.filter(({ title }) => {
              return title.toLowerCase().includes(value.toLowerCase());
            }),
    });
  };

  return (
    <Form.Control
      className='my-3'
      type='text'
      placeholder='Search tasks'
      id='filterTasks'
      size='sm'
      onChange={(e) => onFilterTasks(e.target.value)}
    />
  );
}

export default FilterTaskFrom;
