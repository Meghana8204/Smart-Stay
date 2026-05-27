import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartstay-user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login
  const login = (data) => {
    setUser(data);

    localStorage.setItem("smartstay-user", JSON.stringify(data));
  };

  // Logout
  const logout = () => {
    setUser(null);

    localStorage.removeItem("smartstay-user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
