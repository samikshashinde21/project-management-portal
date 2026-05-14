import { useState, useEffect } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../services/api";


function LoginPage() {

  const navigate = useNavigate();

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

useEffect(() => {

  if (userInfo) {

    if (userInfo.role === "admin") {
      navigate("/admin-dashboard");

    } else if (userInfo.role === "client") {
      navigate("/client-dashboard");

    } else {
      navigate("/user-dashboard");
    }
  }

}, [userInfo, navigate]);


  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

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
    <div className="auth-page">

      <div className="auth-card">

      <h1 className="auth-logo">
  Project Management Website
</h1>


        <h2 className="auth-title">
          Login
        </h2>


        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}


        <form onSubmit={submitHandler}>

          <div className="auth-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          <div className="auth-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>


          <button
            type="submit"
            className="auth-btn"
          >
            Login
          </button>

        </form>


        <p className="auth-switch">

          Don’t have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default LoginPage;
