import DashboardLayout from "../layouts/DashboardLayout";

function AdminDashboard() {

  return (
    <DashboardLayout>

      <div className="topbar">

        <h1 className="page-title">
          Dashboard
        </h1>

        <button className="primary-btn">
          + New Project
        </button>

      </div>


      <div className="dashboard-cards">

        <div className="stat-card">

          <div className="stat-title">
            Projects
          </div>

          <div className="stat-value">
            24
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-title">
            Tasks
          </div>

          <div className="stat-value">
            138
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-title">
            Done
          </div>

          <div className="stat-value">
            89
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-title">
            Overdue
          </div>

          <div
            className="stat-value"
            style={{ color: "#ef4444" }}
          >
            7
          </div>

        </div>

      </div>


      <div className="content-grid">

        <div className="panel">

          <div className="panel-title">
            Recent Tasks
          </div>

          <div className="task-item">
            <span>Design UI</span>

            <span className="task-tag">
              Design
            </span>
          </div>

          <div className="task-item">
            <span>API rate limiting</span>

            <span className="task-tag">
              Backend
            </span>
          </div>

          <div className="task-item">
            <span>Release notes</span>

            <span className="task-tag">
              Docs
            </span>
          </div>

          <div className="task-item">
            <span>Mobile fixes</span>

            <span className="task-tag">
              Frontend
            </span>
          </div>

        </div>


        <div className="panel">

          <div className="panel-title">
            Progress
          </div>


          <div className="progress-item">

            <div className="progress-header">
              <span>Website</span>

              <span>78%</span>
            </div>

            <div className="progress-bar-bg">

              <div
                className="progress-bar-fill"
                style={{ width: "78%" }}
              ></div>

            </div>

          </div>


          <div className="progress-item">

            <div className="progress-header">
              <span>Mobile App</span>

              <span>51%</span>
            </div>

            <div className="progress-bar-bg">

              <div
                className="progress-bar-fill"
                style={{ width: "51%" }}
              ></div>

            </div>

          </div>


          <div className="progress-item">

            <div className="progress-header">
              <span>API Platform</span>

              <span>92%</span>
            </div>

            <div className="progress-bar-bg">

              <div
                className="progress-bar-fill"
                style={{ width: "92%" }}
              ></div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default AdminDashboard;