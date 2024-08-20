import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  authenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  userId: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  login: () => {},
  logout: () => {},
  userId: null,
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setAuthenticated(!!storedUserId);
    setUserId(storedUserId || null);
  }, []);

  const login = (userId: string) => {
    setAuthenticated(true);
    setUserId(userId);
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    setAuthenticated(false);
    setUserId(null);
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
