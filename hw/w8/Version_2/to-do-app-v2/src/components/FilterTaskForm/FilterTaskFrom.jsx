import React, { useEffect, useState } from 'react';

import { Form } from 'react-bootstrap';

function FilterTaskFrom({ onFilterTasks }) {
  const [filterTasks, setFilterTasks] = useState('');

  useEffect(() => {
    onFilterTasks(filterTasks);
  }, [filterTasks, onFilterTasks]);

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
