import { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../services/api";


function RegisterPage() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");


  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      const { data } = await API.post(
        "/users",
        {
          name,
          email,
          password,
        }
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      navigate("/user-dashboard");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1 className="auth-logo">
          Project Management Portal
        </h1>


        <h2 className="auth-title">
          Register
        </h2>


        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}


        <form onSubmit={submitHandler}>

          <div className="auth-group">

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


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
            Register
          </button>

        </form>


        <p className="auth-switch">

          Already have an account?{" "}

          <Link to="/">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default RegisterPage;