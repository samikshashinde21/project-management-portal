import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import PageLoader from "../components/PageLoader";

import API from "../services/api";

import { useAuth } from "../context/AuthContext";


function AdminProjects() {

  const [projects, setProjects] =
    useState([]);

  const [clients, setClients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showProjectForm, setShowProjectForm] =
    useState(false);

  const [editingProject, setEditingProject] =
    useState(null);

  const [projectForm, setProjectForm] =
    useState({
      title: "",
      description: "",
      assignedClient: "",
      assignedDate: "",
      deadline: "",
      status: "pending",
    });

  const [formError, setFormError] =
    useState("");

  const [toast, setToast] =
    useState("");

  const { userInfo } = useAuth();

  const config = {
    headers: {
      Authorization:
        `Bearer ${userInfo?.token}`,
    },
  };


  const fetchProjects = async () => {

    const { data } = await API.get(
      "/projects",
      config
    );

    setProjects(data);
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


  const showToast = (message) => {

    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2400);
  };


  useEffect(() => {

    const loadData = async () => {

      try {
        await Promise.all([
          fetchProjects(),
          fetchClients(),
        ]);
      } catch (error) {
        setFormError(
          error.response?.data?.message ||
            "Unable to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();

  }, []);


  const inputChangeHandler = (e) => {

    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
  };


  const openProjectForm = () => {

    setEditingProject(null);

    setFormError("");

    setProjectForm({
      title: "",
      description: "",
      assignedClient: clients[0]?._id || "",
      assignedDate:
        new Date().toISOString().split("T")[0],
      deadline: "",
      status: "pending",
    });

    setShowProjectForm(true);
  };


  const formatDateInput = (dateValue) => {

    if (!dateValue) {
      return "";
    }

    return new Date(dateValue)
      .toISOString()
      .split("T")[0];
  };


  const openEditProjectForm = (project) => {

    setEditingProject(project);

    setFormError("");

    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      assignedClient:
        project.assignedClient?._id ||
        project.assignedClient ||
        "",
      assignedDate:
        formatDateInput(project.assignedDate),
      deadline:
        formatDateInput(project.deadline),
      status: project.status || "pending",
    });

    setShowProjectForm(true);
  };


  const submitProjectHandler = async (e) => {

    e.preventDefault();

    setFormError("");

    if (
      !projectForm.title.trim() ||
      !projectForm.description.trim() ||
      !projectForm.assignedClient ||
      !projectForm.assignedDate ||
      !projectForm.deadline
    ) {
      setFormError(
        "Please fill all project details."
      );

      return;
    }

    try {
      const payload = {
        title: projectForm.title.trim(),
        description:
          projectForm.description.trim(),
        assignedClient:
          projectForm.assignedClient,
        assignedDate:
          projectForm.assignedDate,
        deadline:
          projectForm.deadline,
        status: projectForm.status,
      };

      if (editingProject) {
        await API.put(
          `/projects/${editingProject._id}`,
          payload,
          config
        );
      } else {
        await API.post(
          "/projects",
          payload,
          config
        );
      }

      await fetchProjects();

      setShowProjectForm(false);

      setEditingProject(null);

      showToast(
        editingProject
          ? "Project updated successfully."
          : "Project created successfully."
      );

    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Project could not be created."
      );
    }
  };


  const statusChangeHandler = async (
    projectId,
    status
  ) => {

    try {
      await API.put(
        `/projects/${projectId}`,
        { status },
        config
      );

      await fetchProjects();

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project._id === projectId
            ? { ...project, status }
            : project
        )
      );

      showToast("Project status updated.");

    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Status update failed."
      );
    }
  };


  if (loading) {
    return <PageLoader />;
  }


  return (
    <DashboardLayout>

      {toast && (
        <div className="toast-message">
          {toast}
        </div>
      )}

      <div className="admin-hero">

        <div>

          <span className="admin-eyebrow">
            Project Control
          </span>

          <h1>Projects</h1>

          <p>
            Create projects and manage client-visible status
            updates from one structured board.
          </p>

        </div>

        <div className="admin-hero-action">

          <button
            className="primary-btn"
            onClick={openProjectForm}
          >
            + New Project
          </button>

        </div>

      </div>


      <div className="admin-quick-stats">

        <div className="quick-stat">
          <span>Total Projects</span>
          <strong>{projects.length}</strong>
        </div>

        <div className="quick-stat">
          <span>Active Clients</span>
          <strong>{clients.length}</strong>
        </div>

        <div className="quick-stat">
          <span>Completed</span>
          <strong>
            {
              projects.filter(
                (project) =>
                  project.status === "completed"
              ).length
            }
          </strong>
        </div>

      </div>


      {showProjectForm && (
        <div className="modal-overlay">

          <div className="project-modal">

            <div className="modal-header">

              <div>

                <h2 className="modal-title">
                  {editingProject
                    ? "Edit Project"
                    : "Add New Project"}
                </h2>

                <p className="modal-subtitle">
                  Assign a project to a client
                </p>

              </div>

              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowProjectForm(false);
                  setEditingProject(null);
                }}
                type="button"
              >
                x
              </button>

            </div>

            <form
              className="project-form"
              onSubmit={submitProjectHandler}
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

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="assignedDate">
                    Assigned Date
                  </label>

                  <input
                    id="assignedDate"
                    name="assignedDate"
                    type="date"
                    value={projectForm.assignedDate}
                    onChange={inputChangeHandler}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deadline">
                    Deadline
                  </label>

                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={projectForm.deadline}
                    onChange={inputChangeHandler}
                  />
                </div>

              </div>

              {editingProject && (
                <div className="form-group">
                  <label htmlFor="status">
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={projectForm.status}
                    onChange={inputChangeHandler}
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="in-progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </select>
                </div>
              )}

              {formError && (
                <div className="form-error">
                  {formError}
                </div>
              )}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowProjectForm(false);
                    setEditingProject(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={clients.length === 0}
                >
                  {editingProject
                    ? "Save Project"
                    : "Create Project"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      <div className="projects-board">

        <div className="projects-board-header admin-projects-header">
          <span>Project Name</span>
          <span>Description</span>
          <span>Client</span>
          <span>Assigned</span>
          <span>Deadline</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {projects.length === 0 ? (
          <p className="empty-state">
            No projects created yet.
          </p>
        ) : (
          projects.map((project) => (
            <div
              className="project-list-row admin-projects-row"
              key={project._id}
            >
              <div className="project-list-title">
                {project.title}
              </div>

              <div className="project-list-description">
                {project.description}
              </div>

              <div className="project-client-cell">
                {project.assignedClient?.name || "Unassigned"}
              </div>

              <div className="project-date-cell">
                {project.assignedDate
                  ? new Date(
                      project.assignedDate
                    ).toLocaleDateString()
                  : "Not set"}
              </div>

              <div className="project-date-cell">
                {project.deadline
                  ? new Date(
                      project.deadline
                    ).toLocaleDateString()
                  : "Not set"}
              </div>

              <select
                className="role-select status-select"
                value={project.status}
                onChange={(e) =>
                  statusChangeHandler(
                    project._id,
                    e.target.value
                  )
                }
              >
                <option value="pending">
                  Pending
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>

              <button
                className="secondary-btn table-btn"
                onClick={() =>
                  openEditProjectForm(project)
                }
              >
                Edit
              </button>
            </div>
          ))
        )}

      </div>

    </DashboardLayout>
  );
}

export default AdminProjects;
