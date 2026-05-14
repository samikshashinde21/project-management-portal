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
import ClientProjects from "./pages/ClientProjects";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./routes/ProtectedRoute";
import UserManagement from "./pages/UserManagement";

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

        <Route
          path="/users"
          element={
            <ProtectedRoute
              allowedRole="admin"
            >
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client-projects"
          element={
            <ProtectedRoute
              allowedRole="client"
            >
              <ClientProjects />
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
