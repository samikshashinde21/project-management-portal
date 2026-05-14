import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";


function AdminDashboard() {

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const userInfo = JSON.parse(
          localStorage.getItem("userInfo")
        );

        const config = {
          headers: {
            Authorization:
              `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await API.get(
          "/dashboard/admin",
          config
        );

        setDashboardData(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

    fetchDashboard();

  }, []);


  if (loading) {
    return <h2>Loading...</h2>;
  }


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
            Total Users
          </div>

          <div className="stat-value">
            {dashboardData.totalUsers}
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-title">
            Total Clients
          </div>

          <div className="stat-value">
            {dashboardData.totalClients}
          </div>

        </div>


        <div className="stat-card">

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


      <div className="content-grid">

        <div className="panel">

          <div className="panel-title">
            Recent Projects
          </div>

          {dashboardData.recentProjects.map(
            (project) => (

              <div
                className="task-item"
                key={project._id}
              >

                <span>
                  {project.title}
                </span>

                <span className="task-tag">
                  {project.status}
                </span>

              </div>
            )
          )}

        </div>


        <div className="panel">

          <div className="panel-title">
            Project Overview
          </div>

          <div className="progress-item">

            <div className="progress-header">
              <span>Completed</span>

              <span>
                {dashboardData.completedProjects}
              </span>
            </div>

            <div className="progress-bar-bg">

              <div
                className="progress-bar-fill"
                style={{ width: "70%" }}
              ></div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default AdminDashboard;