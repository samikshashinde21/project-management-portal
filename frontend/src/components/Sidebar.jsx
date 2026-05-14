import { NavLink } from "react-router-dom";

function Sidebar() {

  return (
    <div className="sidebar">

      <div>

        <div className="logo">
          FlowDesk
        </div>

        <div className="sidebar-menu">

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
            className="sidebar-link"
          >
            Users
          </NavLink>

          <NavLink
            to="/reports"
            className="sidebar-link"
          >
            Reports
          </NavLink>

          <NavLink
            to="/profile"
            className="sidebar-link"
          >
            Profile
          </NavLink>

        </div>

      </div>

      <div className="user-box">

        <div className="user-avatar">
          S
        </div>

        <div className="user-name">
          Samiksha
        </div>

      </div>

    </div>
  );
}

export default Sidebar;