import "./Login.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Schema } from "../types/zod";

const Register = () => {
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
  const onSubmit = (data: Schema) => {
    console.log(data);
  };
  return (
    <div>
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
