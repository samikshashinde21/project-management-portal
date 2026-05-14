import DashboardLayout from "../layouts/DashboardLayout";

function UserDashboard() {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );


  return (
    <DashboardLayout>

      <div className="topbar">

        <div>

          <h1 className="page-title">
            Welcome, {userInfo?.name}
          </h1>

          <p className="table-subtitle">
            Overview of your workspace
          </p>

        </div>

      </div>


      <div className="dashboard-cards">

        <div className="stat-card">

          <div className="stat-title">
            Your Role
          </div>

          <div className="stat-value">
            User
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-title">
            Account Status
          </div>

          <div className="stat-value">
            Active
          </div>

        </div>

      </div>


      <div className="content-grid">

        <div className="panel">

          <div className="panel-title">
            Notifications
          </div>

          <div className="task-item">
            <span>
              Welcome to the portal
            </span>

            <span className="task-tag">
              New
            </span>
          </div>

          <div className="task-item">
            <span>
              Your account is active
            </span>

            <span className="task-tag">
              System
            </span>
          </div>

        </div>


        <div className="panel">

          <div className="panel-title">
            Quick Info
          </div>

          <div className="progress-item">

            <div className="progress-header">
              <span>Profile Completion</span>

              <span>80%</span>
            </div>

            <div className="progress-bar-bg">

              <div
                className="progress-bar-fill"
                style={{ width: "80%" }}
              ></div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default UserDashboard;