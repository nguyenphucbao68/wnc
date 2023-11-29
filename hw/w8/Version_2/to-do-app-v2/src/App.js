import './App.css';
import { TaskProvider } from './contexts/TodoListProvider';
import TodoApp from './pages/TodoApp';

function App() {
  return (
    <TaskProvider>
      <TodoApp />
    </TaskProvider>
  );
}

export default App;
