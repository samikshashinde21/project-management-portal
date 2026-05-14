import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

import { useAuth } from "../context/AuthContext";


function AdminDashboard() {

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const { userInfo } = useAuth();

  const config = {
    headers: {
      Authorization:
        `Bearer ${userInfo?.token}`,
    },
  };


  useEffect(() => {

    const fetchDashboard = async () => {

      try {
        setError("");

        const { data } = await API.get(
          "/dashboard/admin",
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

  if (error || !dashboardData) {
    return (
      <DashboardLayout>
        <div className="form-error">
          {error || "Dashboard data could not be loaded."}
        </div>
      </DashboardLayout>
    );
  }


  const completedPercentage =
    dashboardData.totalProjects > 0
      ? Math.round(
          (dashboardData.completedProjects /
            dashboardData.totalProjects) *
            100
        )
      : 0;

  const pendingPercentage =
    dashboardData.totalProjects > 0
      ? Math.round(
          (dashboardData.pendingProjects /
            dashboardData.totalProjects) *
            100
        )
      : 0;

  const inProgressPercentage =
    dashboardData.totalProjects > 0
      ? Math.round(
          (dashboardData.inProgressProjects /
            dashboardData.totalProjects) *
            100
        )
      : 0;

  const chartStyle = {
    background: `conic-gradient(
      #f59e0b 0 ${pendingPercentage}%,
      #3b82f6 ${pendingPercentage}% ${
        pendingPercentage + inProgressPercentage
      }%,
      #14b8a6 ${
        pendingPercentage + inProgressPercentage
      }% 100%
    )`,
  };


  return (
    <DashboardLayout>

      <div className="admin-hero">

        <div>

          <span className="admin-eyebrow">
            Admin Workspace
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Monitor platform activity, project progress,
            and the people connected to the workspace.
          </p>

        </div>

      </div>


      <div className="dashboard-cards">

        <div className="stat-card accent-teal">
          <div className="stat-title">
            Total Users
          </div>

          <div className="stat-value">
            {dashboardData.totalUsers}
          </div>
        </div>

        <div className="stat-card accent-blue">
          <div className="stat-title">
            Total Clients
          </div>

          <div className="stat-value">
            {dashboardData.totalClients}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            Total Admins
          </div>

          <div className="stat-value">
            {dashboardData.totalAdmins}
          </div>
        </div>

        <div className="stat-card accent-gold">
          <div className="stat-title">
            Total Projects
          </div>

          <div className="stat-value">
            {dashboardData.totalProjects}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">
            Completed Projects
          </div>

          <div className="stat-value">
            {dashboardData.completedProjects}
          </div>
        </div>

      </div>


      <div className="admin-quick-stats">
        <div className="quick-stat">
          <span>Pending Projects</span>
          <strong>{dashboardData.pendingProjects}</strong>
        </div>

        <div className="quick-stat">
          <span>In Progress</span>
          <strong>{dashboardData.inProgressProjects}</strong>
        </div>

        <div className="quick-stat">
          <span>Completed Rate</span>
          <strong>{completedPercentage}%</strong>
        </div>
      </div>


      <div className="content-grid">

        <div className="panel">

          <div className="panel-title">
            Recent Projects
          </div>

          {dashboardData.recentProjects.length === 0 ? (
            <p className="empty-state">
              No projects created yet.
            </p>
          ) : (
            dashboardData.recentProjects.map(
              (project) => (
                <div
                  className="task-item clickable-task"
                  key={project._id}
                  onClick={() =>
                    navigate("/admin-projects")
                  }
                  role="button"
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate("/admin-projects");
                    }
                  }}
                >
                  <span>{project.title}</span>

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
            Project Overview
          </div>

          <div className="project-chart-wrap">

            <div
              className="project-donut"
              style={chartStyle}
            >
              <div className="project-donut-center">
                <strong>{completedPercentage}%</strong>
                <span>Complete</span>
              </div>
            </div>

            <div className="chart-legend">

              <div className="legend-item">
                <span className="legend-dot pending-dot"></span>
                <div>
                  <strong>{dashboardData.pendingProjects}</strong>
                  <p>Pending</p>
                </div>
              </div>

              <div className="legend-item">
                <span className="legend-dot progress-dot"></span>
                <div>
                  <strong>{dashboardData.inProgressProjects}</strong>
                  <p>In Progress</p>
                </div>
              </div>

              <div className="legend-item">
                <span className="legend-dot completed-dot"></span>
                <div>
                  <strong>{dashboardData.completedProjects}</strong>
                  <p>Completed</p>
                </div>
              </div>

            </div>

          </div>

          <div className="progress-item">

            <div className="progress-header">
              <span>Completed</span>
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

export default AdminDashboard;
