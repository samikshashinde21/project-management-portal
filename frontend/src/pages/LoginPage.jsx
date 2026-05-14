import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";


function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");


  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      const { data } = await API.post(
        "/users/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      if (data.role === "admin") {
        navigate("/admin-dashboard");

      } else if (data.role === "client") {
        navigate("/client-dashboard");

      } else {
        navigate("/user-dashboard");
      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };


  return (
    <div className="container mt-5">

      <h2>Login</h2>

      {error && (
        <p className="text-danger">
          {error}
        </p>
      )}

      <form onSubmit={submitHandler}>

        <div className="mb-3">

          <label>Email</label>

          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className="mb-3">

          <label>Password</label>

          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
        >
          Login
        </button>

      </form>

      <p className="mt-3">
        New user?{" "}

        <Link to="/register">
          Register
        </Link>
      </p>

    </div>
  );
}

export default LoginPage;