import React, { createContext, useState } from "react";

export const AuthContext = createContext<{
  authenticated: boolean;
  login: () => void;
  logout: () => void;
}>({
  authenticated: false,
  login: () => {},
  logout: () => {},
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("user") ? true : false
  );
  const login = () => setAuthenticated(true);
  const logout = () => setAuthenticated(false);

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
