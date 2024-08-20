import React from "react";
import "./Login.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Schema } from "../types/zod";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Login = () => {
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
        toast.error("Login failed");
        return;
      }

      const result = await response.json();
      console.log("Login response:", result);

      if (result.loginStatus) {
        toast.success("Login successful");

        // Store userId in localStorage
        if (result.user && result.user._id) {
          localStorage.setItem("userId", result.user._id); // Store _id as userId
          login(result.user._id); // Call the login function to update the state
        } else {
          console.error("User ID (_id) is undefined in the login response");
        }

        // Navigate to the home page or another secure page
        navigate("/");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error: any) {
      toast.error("Login failed", error.message);
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
