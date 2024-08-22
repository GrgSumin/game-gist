import React from "react";
import "./Login.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { Schema } from "../types/zod"; // Ensure Schema is correctly defined

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { register, formState, handleSubmit } = useForm<Schema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors } = formState;
  const { login } = useAuth();

  const onSubmit = async (data: Schema) => {
    try {
      const response = await fetch("http://localhost:4001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(
          "Login failed: " + (errorResponse.message || "Unknown error")
        );
        return;
      }

      const result = await response.json();
      console.log("Login response:", result);

      if (result.loginStatus) {
        toast.success("Login successful");

        if (result.user && result.user.userId) {
          localStorage.setItem("userId", result.user.userId);
          login(result.user.userId);
          navigate("/");
        } else {
          console.error("User ID (userId) is undefined in the login response");
        }
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="main">
        <div className="first">
          <h1>Login</h1>
          <TextField
            id="standard-basic"
            label="Email"
            variant="standard"
            type="email"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            id="filled-basic"
            label="Password"
            variant="standard"
            type="password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <h6>Forgot password?</h6>
          <div className="btnContain">
            <Button
              sx={{ background: "black" }}
              variant="contained"
              onClick={handleSubmit(onSubmit)}
            >
              Login
            </Button>
            <Link to="/register">
              <Button variant="outlined" color="success">
                SignUp
              </Button>
            </Link>
          </div>
        </div>
        <div className="second"></div>
      </div>
    </div>
  );
};

export default Login;
