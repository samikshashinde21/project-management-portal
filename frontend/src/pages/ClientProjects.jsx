import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";


function ClientProjects() {

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const fetchProjects = async () => {

      try {

        const userInfo = JSON.parse(
          localStorage.getItem("userInfo")
        );

        const config = {
          headers: {
            Authorization:
              `Bearer ${userInfo?.token}`,
          },
        };

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

    fetchProjects();

  }, []);


  if (loading) {
    return <h2>Loading...</h2>;
  }


  return (
    <DashboardLayout>

      <div className="topbar">

        <div>

          <h1 className="page-title">
            Client Projects
          </h1>

          <p className="table-subtitle">
            View your assigned projects and current status
          </p>

        </div>

      </div>


      {error ? (
        <div className="form-error">
          {error}
        </div>
      ) : (
        <div className="projects-board">

          <div className="projects-board-header">

            <span>Project Name</span>

            <span>Description</span>

            <span>Status</span>

          </div>


          {projects.length === 0 ? (
            <p className="empty-state">
              No projects have been assigned yet.
            </p>
          ) : (
            projects.map((project) => (

              <div
                className="project-list-row"
                key={project._id}
              >

                <div className="project-list-title">
                  {project.title}
                </div>

                <div className="project-list-description">
                  {project.description}
                </div>

                <div>
                  <span
                    className={`task-tag status-${project.status}`}
                  >
                    {project.status}
                  </span>
                </div>

              </div>
            ))
          )}

        </div>
      )}

    </DashboardLayout>
  );
}

export default ClientProjects;
