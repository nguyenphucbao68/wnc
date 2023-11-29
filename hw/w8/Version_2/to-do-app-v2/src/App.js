import './App.css';
import { TaskProvider } from './contexts/TaskProvider';
import TodoApp from './pages/TodoApp';

function App() {
  return (
    <TaskProvider>
      <TodoApp />
    </TaskProvider>
  );
}

export default App;
