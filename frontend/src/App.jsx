import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import UserDashboard from "./pages/UserDashboard";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/client-dashboard"
          element={<ClientDashboard />}
        />

        <Route
          path="/user-dashboard"
          element={<UserDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;