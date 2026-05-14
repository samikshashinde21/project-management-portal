import {
  useEffect,
  useState,
} from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  allowedRole,
}) {

  const { userInfo, validateToken } = useAuth();

  const [checkingToken, setCheckingToken] =
    useState(true);

  const [tokenIsValid, setTokenIsValid] =
    useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (
        !userInfo ||
        (allowedRole && userInfo.role !== allowedRole)
      ) {
        setTokenIsValid(false);
        setCheckingToken(false);
        return;
      }

      const isValid = await validateToken();

      setTokenIsValid(isValid);
      setCheckingToken(false);
    };

    checkToken();
  }, [userInfo, allowedRole, validateToken]);

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  if (
    allowedRole &&
    userInfo.role !== allowedRole
  ) {
    return <Navigate to="/" />;
  }

  if (checkingToken) {
    return <h2>Loading...</h2>;
  }

  if (!tokenIsValid) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
