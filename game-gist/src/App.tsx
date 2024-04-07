import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./login-system/Login";
import Register from "./login-system/Register";
import Navbar from "./navbar/Navbar";
import News from "./news-app/News";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </>
  );
}

export default App;
