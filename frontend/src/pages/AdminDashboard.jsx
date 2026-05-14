import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";


function AdminDashboard() {

  const [dashboardData, setDashboardData] =
    useState(null);

  const [clients, setClients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showProjectForm, setShowProjectForm] =
    useState(false);

  const [projectForm, setProjectForm] =
    useState({
      title: "",
      description: "",
      assignedClient: "",
    });

  const [formError, setFormError] =
    useState("");

  const [creatingProject, setCreatingProject] =
    useState(false);


  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const config = {
    headers: {
      Authorization:
        `Bearer ${userInfo?.token}`,
    },
  };


  const fetchDashboard = async () => {

    const { data } = await API.get(
      "/dashboard/admin",
      config
    );

    setDashboardData(data);
  };


  const fetchClients = async () => {

    const { data } = await API.get(
      "/users",
      config
    );

    setClients(
      data.filter((user) => user.role === "client")
    );
  };


  useEffect(() => {

    const loadAdminData = async () => {

      try {

        await Promise.all([
          fetchDashboard(),
          fetchClients(),
        ]);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

    loadAdminData();

  }, []);


  const inputChangeHandler = (e) => {

    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
  };


  const openProjectForm = () => {

    setFormError("");

    setProjectForm({
      title: "",
      description: "",
      assignedClient: clients[0]?._id || "",
    });

    setShowProjectForm(true);
  };


  const closeProjectForm = () => {

    if (creatingProject) {
      return;
    }

    setShowProjectForm(false);

    setFormError("");
  };


  const submitProjectHandler = async (e) => {

    e.preventDefault();

    setFormError("");

    if (
      !projectForm.title.trim() ||
      !projectForm.description.trim() ||
      !projectForm.assignedClient
    ) {
      setFormError(
        "Please fill all project details."
      );

      return;
    }

    try {

      setCreatingProject(true);

      await API.post(
        "/projects",
        {
          title: projectForm.title.trim(),
          description:
            projectForm.description.trim(),
          assignedClient:
            projectForm.assignedClient,
        },
        config
      );

      await fetchDashboard();

      setShowProjectForm(false);

      setProjectForm({
        title: "",
        description: "",
        assignedClient: "",
      });

    } catch (error) {

      setFormError(
        error.response?.data?.message ||
          "Project could not be created."
      );

    } finally {

      setCreatingProject(false);
    }
  };


  if (loading) {
    return <h2>Loading...</h2>;
  }

  const completedPercentage =
    dashboardData.totalProjects > 0
      ? Math.round(
          (dashboardData.completedProjects /
            dashboardData.totalProjects) *
            100
        )
      : 0;


  return (
    <DashboardLayout>

      <div className="topbar">

        <h1 className="page-title">
          Dashboard
        </h1>

        <button
          className="primary-btn"
          onClick={openProjectForm}
        >
          + New Project
        </button>

      </div>


      {showProjectForm && (
        <div className="modal-overlay">

          <div className="project-modal">

            <div className="modal-header">

              <div>

                <h2 className="modal-title">
                  Add New Project
                </h2>

                <p className="modal-subtitle">
                  Assign a project to a client
                </p>

              </div>

              <button
                className="modal-close-btn"
                onClick={closeProjectForm}
                type="button"
              >
                x
              </button>

            </div>


            <form
              onSubmit={submitProjectHandler}
              className="project-form"
            >

              <div className="form-group">

                <label htmlFor="title">
                  Project Title
                </label>

                <input
                  id="title"
                  name="title"
                  value={projectForm.title}
                  onChange={inputChangeHandler}
                  placeholder="Website redesign"
                />

              </div>


              <div className="form-group">

                <label htmlFor="assignedClient">
                  Client
                </label>

                <select
                  id="assignedClient"
                  name="assignedClient"
                  value={projectForm.assignedClient}
                  onChange={inputChangeHandler}
                  disabled={clients.length === 0}
                >

                  {clients.length === 0 ? (
                    <option value="">
                      No clients available
                    </option>
                  ) : (
                    clients.map((client) => (
                      <option
                        key={client._id}
                        value={client._id}
                      >
                        {client.name} - {client.email}
                      </option>
                    ))
                  )}

                </select>

              </div>


              <div className="form-group">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={projectForm.description}
                  onChange={inputChangeHandler}
                  placeholder="Describe the project scope"
                  rows="4"
                ></textarea>

              </div>


              {formError && (
                <div className="form-error">
                  {formError}
                </div>
              )}


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeProjectForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={
                    creatingProject ||
                    clients.length === 0
                  }
                >
                  {creatingProject
                    ? "Creating..."
                    : "Create Project"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


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

          {dashboardData.recentProjects.length === 0 ? (
            <p className="empty-state">
              No projects created yet.
            </p>
          ) : (
            dashboardData.recentProjects.map(
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
                {completedPercentage}%
              </span>
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
