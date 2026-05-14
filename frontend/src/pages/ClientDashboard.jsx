import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";


function ClientDashboard() {

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );


  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const config = {
          headers: {
            Authorization:
              `Bearer ${userInfo?.token}`,
          },
        };

        const { data } = await API.get(
          "/dashboard/client",
          config
        );

        setDashboardData(data);

      } catch (error) {

        setError(
          error.response?.data?.message ||
            "Unable to load dashboard."
        );

      } finally {

        setLoading(false);
      }
    };

    fetchDashboard();

  }, []);


  if (loading) {
    return <h2>Loading...</h2>;
  }


  if (error) {
    return (
      <DashboardLayout>
        <div className="form-error">
          {error}
        </div>
      </DashboardLayout>
    );
  }


  const completedPercentage =
    dashboardData.assignedProjects > 0
      ? Math.round(
          (dashboardData.completedProjects /
            dashboardData.assignedProjects) *
            100
        )
      : 0;


  return (
    <DashboardLayout>

      <div className="topbar">

        <div>

          <h1 className="page-title">
            Welcome, {userInfo?.name}
          </h1>

          <p className="table-subtitle">
            Your project workspace at a glance
          </p>

        </div>

      </div>


      <div className="client-summary-band">

        <div>

          <div className="summary-kicker">
            Client Portal
          </div>

          <h2>
            Track assigned work and keep projects moving.
          </h2>

        </div>

        <div className="summary-score">

          <span>{completedPercentage}%</span>

          <p>completed</p>

        </div>

      </div>


      <div className="dashboard-cards">

        <div className="stat-card accent-teal">

          <div className="stat-title">
            Assigned Projects
          </div>

          <div className="stat-value">
            {dashboardData.assignedProjects}
          </div>

        </div>


        <div className="stat-card accent-blue">

          <div className="stat-title">
            In Progress
          </div>

          <div className="stat-value">
            {dashboardData.inProgressProjects}
          </div>

        </div>


        <div className="stat-card accent-gold">

          <div className="stat-title">
            Completed
          </div>

          <div className="stat-value">
            {dashboardData.completedProjects}
          </div>

        </div>

      </div>


      <div className="content-grid">

        <div className="panel">

          <div className="panel-title">
            Project Overview
          </div>

          {dashboardData.recentProjects.length === 0 ? (
            <p className="empty-state">
              No projects have been assigned yet.
            </p>
          ) : (
            dashboardData.recentProjects.map(
              (project) => (

                <div
                  className="task-item project-row"
                  key={project._id}
                >

                  <div>

                    <span className="project-name">
                      {project.title}
                    </span>

                    <p className="project-description">
                      {project.description}
                    </p>

                  </div>

                  <span
                    className={`task-tag status-${project.status}`}
                  >
                    {project.status}
                  </span>

                </div>
              )
            )
          )}

        </div>


        <div className="panel">

          <div className="panel-title">
            Notifications
          </div>

          <div className="notification-item">

            <div className="notification-dot"></div>

            <div>

              <strong>Workspace ready</strong>

              <p>
                Your assigned projects will appear here.
              </p>

            </div>

          </div>


          <div className="progress-item">

            <div className="progress-header">
              <span>Completion Rate</span>

              <span>{completedPercentage}%</span>
            </div>

            <div className="progress-bar-bg">

              <div
                className="progress-bar-fill"
                style={{
                  width: `${completedPercentage}%`,
                }}
              ></div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default ClientDashboard;
