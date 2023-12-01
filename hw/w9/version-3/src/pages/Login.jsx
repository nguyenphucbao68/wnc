import { useForm } from "react-hook-form";
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues:{
        username: "",
        password: ""
    }
  });
  const [invalidSubmit, setInvalidSubmit] = useState(false);
  const navigate = useNavigate();
  const onSubmit = (data) => {
    if(data.password === "Admin"){
        localStorage.isLogin = true;
        localStorage.username = data.username;
        navigate("/todo");
    }
    else setInvalidSubmit(true);
    
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("username", { required: "Username is required" })}
          placeholder="Username"
        />
        <p>{errors.username?.message}</p>
        <input
          {...register("password", {
            required: "Password is required",
            validate: {//custom validate
              notLessThanFour: (v) =>
                v.length >= 4 || "Password must has at least 4 characters",
            },
          })}
          placeholder="Password"
          type="password"
        />
        <p>{errors.password?.message}</p>
        <input type="submit"/>
      </form>
      {invalidSubmit && <div>Invalid username & password</div>}
    </div>
  );
};

export default Login;
