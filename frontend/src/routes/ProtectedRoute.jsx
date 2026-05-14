import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRole,
}) {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

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