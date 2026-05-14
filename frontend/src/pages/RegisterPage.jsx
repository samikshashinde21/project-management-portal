import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../services/api";

const passwordRuleMessage =
  "Password must be more than 6 characters and include one uppercase letter and one symbol.";

const isValidPassword = (password) =>
  password.length > 6 &&
  /[A-Z]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);


function RegisterPage() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");

  const [maintenanceMode, setMaintenanceMode] =
    useState(false);

  const [checkingMaintenance, setCheckingMaintenance] =
    useState(true);


  useEffect(() => {

    const fetchMaintenanceStatus = async () => {

      try {
        const { data } = await API.get(
          "/settings/public"
        );

        setMaintenanceMode(
          data.maintenanceMode === true
        );

      } catch (error) {
        console.log(error);

      } finally {
        setCheckingMaintenance(false);
      }
    };

    fetchMaintenanceStatus();

  }, []);


  const submitHandler = async (e) => {

    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Name, email and password are required");
      return;
    }

    if (!isValidPassword(password)) {
      setError(passwordRuleMessage);
      return;
    }

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
          Project Management Website
        </h1>


        <h2 className="auth-title">
          Register
        </h2>


        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}


        {checkingMaintenance ? (
          <p className="auth-subtitle">
            Checking registration status...
          </p>
        ) : maintenanceMode ? (
          <div className="maintenance-card">
            <h3>Maintenance</h3>

            <p>
              New registrations are temporarily closed.
              Please try again later or contact the admin.
            </p>
          </div>
        ) : (
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
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <p className="password-hint">
                More than 6 characters, one uppercase
                letter, and one symbol.
              </p>

            </div>


            <button
              type="submit"
              className="auth-btn"
            >
              Register
            </button>

          </form>
        )}


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
