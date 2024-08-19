import "./Login.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Schema } from "../types/zod";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const form = useForm<Schema>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
      phonenumber: undefined,
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const onSubmit = async (data: Schema) => {
    try {
      if (!formState.isValid) {
        toast.error("Invalid format");
        return;
      }

      const response = await fetch(
        "http://localhost:4001/api/users/registers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        toast.error("Registeration failed");
      }
      toast.success("Registeration sucessfull");
      navigate("/login");
    } catch (error: any) {
      toast.error("Registeration failed", error);
    }
  };
  return (
    <div className="login-page">
      <div className="main">
        <div className="first">
          <h1>Registration</h1>
          <TextField
            id="standard-basic"
            label="Email"
            variant="standard"
            type="email"
            {...register("email", { required: "email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
          <TextField
            id="standard-basic"
            label="Username"
            variant="standard"
            type="text"
            {...register("username", { required: "username is required" })}
            error={!!errors.username}
            helperText={errors.username?.message}
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
          <TextField
            id="standard-basic"
            label="Phonenumber"
            variant="standard"
            type="number"
            {...register("phonenumber", {
              required: "phonenumber is required",
            })}
            error={!!errors.phonenumber}
            helperText={errors.phonenumber?.message}
          />

          <div className="btnContain">
            <Link to="/login">
              <Button
                variant="outlined"
                color="success"
                onClick={handleSubmit(onSubmit)}
              >
                Register
              </Button>
            </Link>
          </div>
        </div>
        <div className="second"></div>
      </div>
    </div>
  );
};

export default Register;
