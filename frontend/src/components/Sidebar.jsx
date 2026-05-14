import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar() {

  const navigate = useNavigate();

  const { userInfo, logout } = useAuth();


  const logoutHandler = () => {

    logout();

    navigate("/");
  };


  return (
    <div className="sidebar">

      <div>

        <div className="logo">
          Project Management Website
        </div>


        <div className="sidebar-menu">

          {/* ADMIN LINKS */}

          {userInfo?.role === "admin" && (
            <>

              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link"
                    : "sidebar-link"
                }
              >
                Dashboard
              </NavLink>


              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link"
                    : "sidebar-link"
                }
              >
                Users
              </NavLink>

              <NavLink
                to="/clients"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link"
                    : "sidebar-link"
                }
              >
                Clients
              </NavLink>

              <NavLink
                to="/admin-projects"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link"
                    : "sidebar-link"
                }
              >
                Projects
              </NavLink>


              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link"
                    : "sidebar-link"
                }
              >
                Reports
              </NavLink>

            </>
          )}


          {/* CLIENT LINKS */}

          {userInfo?.role === "client" && (
            <>

              <NavLink
                to="/client-dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link"
                    : "sidebar-link"
                }
              >
                Dashboard
              </NavLink>


              <NavLink
                to="/client-projects"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link"
                    : "sidebar-link"
                }
              >
                Projects
              </NavLink>

            </>
          )}


          {/* USER LINKS */}

          {userInfo?.role === "user" && (
            <>

              <NavLink
                to="/user-dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active-link"
                    : "sidebar-link"
                }
              >
                Dashboard
              </NavLink>

            </>
          )}


        </div>

      </div>


<div className="profile-dropdown">

  <div className="user-box">

    <div className="user-avatar">
      {userInfo?.profileImage ? (
        <img
          src={userInfo.profileImage}
          alt={userInfo?.name}
        />
      ) : (
        userInfo?.name?.charAt(0)
      )}
    </div>

    <div className="user-name">
      {userInfo?.name}
    </div>

  </div>


  <div className="dropdown-menu-custom">

    {userInfo?.role === "admin" ? (
      <NavLink
        to="/settings"
        className="dropdown-link"
      >
        Settings
      </NavLink>
    ) : (
      <NavLink
        to="/profile"
        className="dropdown-link"
      >
        Profile
      </NavLink>
    )}


    <button
      className="dropdown-logout"
      onClick={logoutHandler}
    >
      Logout
    </button>

  </div>

</div>

    </div>
  );
}

export default Sidebar;
