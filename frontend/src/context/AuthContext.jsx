import {
  createContext,
  useContext,
  useState,
} from "react";

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

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
