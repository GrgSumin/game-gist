import "./Login.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Schema } from "../types/zod";

const Login = () => {
  const { register, formState, handleSubmit } = useForm<Schema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors } = formState;
  const onSubmit = (data: Schema) => {
    console.log(data);
  };
  return (
    <div>
      <div className="main">
        <div className="first">
          <h1>Login</h1>
          <TextField
            id="standard-basic"
            label="Email"
            variant="standard"
            type="email"
            {...register("email", { required: "email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            id="filled-basic"
            label="Password"
            variant="standard"
            type="password"
            {...register("password", { required: "password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <h6>Forgot password?</h6>
          <div className="btnContain">
            <Button
              sx={{
                background: "black",
              }}
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
