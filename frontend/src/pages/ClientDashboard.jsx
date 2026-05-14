import { useCallback, useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import PageLoader from "../components/PageLoader";

import API from "../services/api";

import { useAuth } from "../context/AuthContext";


function ClientDashboard() {

  const location = useLocation();

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const { userInfo } = useAuth();


  const fetchDashboard = useCallback(async () => {

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
  }, [userInfo?.token]);


  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard, location.pathname]);


  if (loading) {
    return <PageLoader />;
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

  const pendingProjects =
    dashboardData.assignedProjects -
    dashboardData.inProgressProjects -
    dashboardData.completedProjects;

  const pendingPercentage =
    dashboardData.assignedProjects > 0
      ? Math.round(
          (pendingProjects /
            dashboardData.assignedProjects) *
            100
        )
      : 0;

  const inProgressPercentage =
    dashboardData.assignedProjects > 0
      ? Math.round(
          (dashboardData.inProgressProjects /
            dashboardData.assignedProjects) *
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
                  <strong>{pendingProjects}</strong>
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
