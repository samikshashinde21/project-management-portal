import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import PageLoader from "../components/PageLoader";

import API from "../services/api";

import { useAuth } from "../context/AuthContext";


function ClientProjects() {

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
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


  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2400);
  };


  const fetchProjects = async () => {

    try {
      const { data } = await API.get(
        "/projects",
        config
      );

      setProjects(data);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load projects."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProjects();
  }, []);


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


  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not set";
    }

    return new Date(dateValue).toLocaleDateString();
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

      <div className="client-summary-band">
        <div>
          <div className="summary-kicker">
            Assigned Work
          </div>

          <h2>
            Review project details and keep statuses
            updated.
          </h2>
        </div>
      </div>


      {error ? (
        <div className="form-error">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <p className="empty-state">
          No projects have been assigned yet.
        </p>
      ) : (
        <div className="client-project-grid">
          {projects.map((project) => (
            <div
              className="client-project-card"
              key={project._id}
            >
              <div className="client-project-card-header">
                <div>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                </div>

                <span
                  className={`task-tag status-${project.status}`}
                >
                  {project.status}
                </span>
              </div>

              <div className="project-date-grid">
                <div>
                  <span>Assigned</span>
                  <strong>
                    {formatDate(project.assignedDate)}
                  </strong>
                </div>

                <div>
                  <span>Deadline</span>
                  <strong>
                    {formatDate(project.deadline)}
                  </strong>
                </div>
              </div>

              <div className="form-group project-card-status">
                <label htmlFor={`status-${project._id}`}>
                  Update Status
                </label>

                <select
                  id={`status-${project._id}`}
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
              </div>
            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
}

export default ClientProjects;
