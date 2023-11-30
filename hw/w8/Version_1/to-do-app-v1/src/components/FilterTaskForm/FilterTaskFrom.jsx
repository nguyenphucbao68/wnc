import React, { useEffect, useState } from 'react';

import { Form } from 'react-bootstrap';

function FilterTaskFrom({ onFilterTasks }) {
  const [filterTasks, setFilterTasks] = useState('');

  useEffect(() => {
    onFilterTasks(filterTasks);
  }, [filterTasks, onFilterTasks]);

  return (
    <Form.Control
      className='my-3'
      type='text'
      placeholder='Search tasks'
      id='filterTasks'
      size='sm'
      value={filterTasks}
      onChange={(e) => setFilterTasks(e.target.value)}
    ></Form.Control>
  );
}

export default FilterTaskFrom;
