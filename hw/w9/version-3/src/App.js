import "./App.css";
import { TaskProvider } from "./contexts/TaskProvider";
import TodoApp from "./pages/TodoApp";
import Login from "./pages/Login";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route
        index
        element={<Login />}
      />
      <Route element={<PrivateRoute />}>
        <Route
          path="/todo"
          element={
            <TaskProvider>
              <TodoApp />
            </TaskProvider>
          }
        />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
