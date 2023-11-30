import React, { useContext } from 'react';

import { Form } from 'react-bootstrap';
import { TaskContext } from '../../contexts/TaskProvider';

function FilterTaskFrom() {
  const {filterKey, setFilterKey} = useContext(TaskContext)

  return (
    <Form.Control
      type='text'
      id='filterTasks'
      size='sm'
      value={filterKey}
      onChange={(e) => setFilterKey(e.target.value)}
    />
  );
}

export default FilterTaskFrom;
