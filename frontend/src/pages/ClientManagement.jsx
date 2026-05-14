import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

const passwordRuleMessage =
  "Password must be more than 6 characters and include one uppercase letter and one symbol.";

const isValidPassword = (password) =>
  password.length > 6 &&
  /[A-Z]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);


const emptyClientForm = {
  name: "",
  email: "",
  password: "",
  role: "client",
};


function ClientManagement() {

  const [clients, setClients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editingClient, setEditingClient] =
    useState(null);

  const [formData, setFormData] =
    useState(emptyClientForm);

  const [formError, setFormError] =
    useState("");

  const [toast, setToast] =
    useState("");

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

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


  const fetchClients = async () => {

    try {
      const { data } = await API.get(
        "/users",
        config
      );

      setClients(
        data.filter((user) => user.role === "client")
      );

    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Unable to load clients."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchClients();
  }, []);


  const openAddForm = () => {
    setEditingClient(null);
    setFormData(emptyClientForm);
    setFormError("");
    setShowForm(true);
  };


  const openEditForm = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      password: "",
      role: client.role,
    });
    setFormError("");
    setShowForm(true);
  };


  const inputChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const submitHandler = async (e) => {
    e.preventDefault();

    setFormError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      (!editingClient && !formData.password.trim())
    ) {
      setFormError("Please fill all required fields.");
      return;
    }

    if (
      formData.password.trim() &&
      !isValidPassword(formData.password)
    ) {
      setFormError(passwordRuleMessage);
      return;
    }

    try {
      if (editingClient) {
        await API.put(
          `/users/${editingClient._id}`,
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            role: formData.role,
          },
          config
        );

        showToast(
          formData.role === "client"
            ? "Client updated successfully."
            : "Role updated. Client moved to Users."
        );
      } else {
        await API.post(
          "/users/admin",
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            role: "client",
          },
          config
        );

        showToast("Client added successfully.");
      }

      setShowForm(false);
      await fetchClients();

    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Client could not be saved."
      );
    }
  };


  const deleteHandler = async (id) => {

    try {
      await API.delete(
        `/users/${id}`,
        config
      );

      await fetchClients();
      showToast("Client deleted successfully.");

    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };


  if (loading) {
    return <h2>Loading...</h2>;
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
            Client Directory
          </span>

          <h1>Client Management</h1>

          <p>
            Add, update, delete clients and manage roles
            for project assignment access.
          </p>
        </div>

        <div className="admin-hero-action">
          <button
            className="primary-btn"
            onClick={openAddForm}
          >
            + Add Client
          </button>
        </div>
      </div>


      <div className="admin-quick-stats">
        <div className="quick-stat">
          <span>Total Clients</span>
          <strong>{clients.length}</strong>
        </div>

        <div className="quick-stat">
          <span>Project Access</span>
          <strong>{clients.length}</strong>
        </div>

        <div className="quick-stat">
          <span>Role</span>
          <strong>Client</strong>
        </div>
      </div>


      {showForm && (
        <div className="modal-overlay">
          <div className="project-modal">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {editingClient
                    ? "Edit Client"
                    : "Add Client"}
                </h2>
                <p className="modal-subtitle">
                  Manage client account details
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={() => setShowForm(false)}
                type="button"
              >
                x
              </button>
            </div>

            <form
              className="project-form"
              onSubmit={submitHandler}
            >
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={inputChangeHandler}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={inputChangeHandler}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required={!editingClient}
                  value={formData.password}
                  onChange={inputChangeHandler}
                  placeholder={
                    editingClient
                      ? "Leave blank to keep current password"
                      : "Enter password"
                  }
                />
                <p className="password-hint">
                  More than 6 characters, one uppercase
                  letter, and one symbol.
                </p>
              </div>

              {editingClient && (
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={inputChangeHandler}
                  >
                    <option value="client">Client</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
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
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>
                  <span className="role-pill">
                    {client.role}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="secondary-btn table-btn"
                      onClick={() =>
                        openEditForm(client)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteHandler(client._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </DashboardLayout>
  );
}

export default ClientManagement;
