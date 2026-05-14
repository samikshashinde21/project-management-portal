import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRole,
}) {

  const { userInfo } = useAuth();

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  if (
    allowedRole &&
    userInfo.role !== allowedRole
  ) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
