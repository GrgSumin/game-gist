import { useContext } from "react";
import { AuthContext } from "../context/Context";

const useAuth = () => {
  const { authenticated, login, logout, userId } = useContext(AuthContext);
  return { authenticated, login, logout, userId };
};

export default useAuth;
