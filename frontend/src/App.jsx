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

import ProtectedRoute from "./routes/ProtectedRoute";


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
          element={
            <ProtectedRoute
              allowedRole="admin"
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute
              allowedRole="client"
            >
              <ClientDashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute
              allowedRole="user"
            >
              <UserDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;