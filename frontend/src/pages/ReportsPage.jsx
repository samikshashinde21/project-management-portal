import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

import { useAuth } from "../context/AuthContext";


function ReportsPage() {

  const [reportData, setReportData] =
    useState(null);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [filterBy, setFilterBy] =
    useState("project-period");

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


  const fetchReports = async () => {

    try {
      setError("");

      const params = {};

      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
        params.filterBy = filterBy;
      }

      const { data } = await API.get(
        "/reports/projects",
        {
          ...config,
          params,
        }
      );

      setReportData(data);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReports();
  }, []);


  const exportCsvHandler = () => {

    if (!reportData?.projects?.length) {
      return;
    }

    const formatCsvDate = (dateValue) => {
      if (!dateValue) {
        return "";
      }

      const formattedDate = new Date(dateValue)
        .toISOString()
        .split("T")[0];

      return `="${formattedDate}"`;
    };

    const rows = [
      [
        "Project",
        "Description",
        "Client",
        "Status",
        "Assigned Date",
        "Deadline",
      ],
      ...reportData.projects.map((project) => [
        project.title,
        project.description,
        project.assignedClient?.name || "Unassigned",
        project.status,
        formatCsvDate(project.assignedDate),
        formatCsvDate(project.deadline),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "project-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };


  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!reportData) {
    return (
      <DashboardLayout>
        <div className="form-error">
          {error || "Reports could not be loaded."}
        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout>

      <div className="admin-hero">

        <div>
          <span className="admin-eyebrow">
            Reporting
          </span>

          <h1>Reports</h1>

          <p>
            Review project statistics, filter by project
            dates, and export project data as CSV.
          </p>
        </div>

        <div className="admin-hero-action">
          <button
            className="primary-btn"
            onClick={exportCsvHandler}
            disabled={!reportData?.projects?.length}
          >
            Export CSV
          </button>
        </div>

      </div>


      <div className="report-filters">

        <div className="form-group">
          <label htmlFor="filterBy">
            Filter Type
          </label>
          <select
            id="filterBy"
            value={filterBy}
            onChange={(e) =>
              setFilterBy(e.target.value)
            }
          >
            <option value="project-period">
              Project Period
            </option>

            <option value="assigned-date">
              Assigned Date
            </option>

            <option value="deadline">
              Deadline
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">
            From
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">
            To
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
          />
        </div>

        <button
          className="primary-btn"
          onClick={fetchReports}
        >
          Apply Filter
        </button>

      </div>


      {error && (
        <div className="form-error">
          {error}
        </div>
      )}


      <div className="admin-quick-stats">
        <div className="quick-stat">
          <span>Total Projects</span>
          <strong>{reportData.totalProjects}</strong>
        </div>

        <div className="quick-stat">
          <span>Pending</span>
          <strong>{reportData.pendingProjects}</strong>
        </div>

        <div className="quick-stat">
          <span>In Progress</span>
          <strong>{reportData.inProgressProjects}</strong>
        </div>

        <div className="quick-stat">
          <span>Completed</span>
          <strong>{reportData.completedProjects}</strong>
        </div>
      </div>


      <div className="projects-board">
        <div className="projects-board-header reports-projects-header">
          <span>Project Name</span>
          <span>Description</span>
          <span>Client</span>
          <span>Assigned</span>
          <span>Deadline</span>
          <span>Status</span>
        </div>

        {reportData.projects.length === 0 ? (
          <p className="empty-state">
            No projects found for this report.
          </p>
        ) : (
          reportData.projects.map((project) => (
            <div
              className="project-list-row reports-projects-row"
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

              <span
                className={`task-tag status-${project.status}`}
              >
                {project.status}
              </span>
            </div>
          ))
        )}
      </div>

    </DashboardLayout>
  );
}

export default ReportsPage;
