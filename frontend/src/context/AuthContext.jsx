import {
  createContext,
  useContext,
  useState,
} from "react";

import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    localStorage.setItem(
      "userInfo",
      JSON.stringify(userData)
    );

    setUserInfo(userData);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem(
      "userInfo",
      JSON.stringify(userData)
    );

    setUserInfo(userData);
  };

  const validateToken = async () => {
    if (!userInfo?.token) {
      logout();
      return false;
    }

    try {
      await API.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        login,
        logout,
        updateUser,
        validateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
