import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";


function SettingsPage() {

  const [settings, setSettings] =
    useState({
      systemName: "",
      allowRegistration: true,
      defaultProjectStatus: "pending",
    });

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [toast, setToast] =
    useState("");

  const [error, setError] =
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


  const fetchSettings = async () => {
    try {
      const { data } = await API.get(
        "/settings",
        config
      );

      setSettings({
        systemName: data.systemName || "",
        allowRegistration:
          data.allowRegistration ?? true,
        defaultProjectStatus:
          data.defaultProjectStatus || "pending",
      });

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load settings."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSettings();
  }, []);


  const settingsChangeHandler = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  const passwordChangeHandler = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };


  const saveSettingsHandler = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const { data } = await API.put(
        "/settings",
        settings,
        config
      );

      setSettings({
        systemName: data.systemName,
        allowRegistration: data.allowRegistration,
        defaultProjectStatus:
          data.defaultProjectStatus,
      });

      showToast("Settings saved successfully.");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Settings could not be saved."
      );
    }
  };


  const changePasswordHandler = async (e) => {
    e.preventDefault();

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      setError("");

      const { data } = await API.put(
        "/settings/password",
        {
          currentPassword:
            passwordForm.currentPassword,
          newPassword:
            passwordForm.newPassword,
        },
        config
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showToast("Password changed successfully.");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Password could not be changed."
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
            System Settings
          </span>

          <h1>Settings</h1>

          <p>
            Control registration, default project status,
            and update your admin password.
          </p>
        </div>
      </div>


      {error && (
        <div className="form-error settings-error">
          {error}
        </div>
      )}


      <div className="settings-grid">

        <div className="panel">
          <div className="panel-title">
            System Rules
          </div>

          <form
            className="project-form"
            onSubmit={saveSettingsHandler}
          >
            <div className="form-group">
              <label htmlFor="systemName">
                System Name
              </label>

              <input
                id="systemName"
                name="systemName"
                value={settings.systemName}
                onChange={settingsChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="defaultProjectStatus">
                Default Project Status
              </label>

              <select
                id="defaultProjectStatus"
                name="defaultProjectStatus"
                value={settings.defaultProjectStatus}
                onChange={settingsChangeHandler}
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

            <label className="settings-toggle">
              <input
                type="checkbox"
                name="allowRegistration"
                checked={settings.allowRegistration}
                onChange={settingsChangeHandler}
              />
              <span>
                Allow public user registration
              </span>
            </label>

            <div className="modal-actions">
              <button
                type="submit"
                className="primary-btn"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>


        <div className="panel">
          <div className="panel-title">
            Change Password
          </div>

          <form
            className="project-form"
            onSubmit={changePasswordHandler}
          >
            <div className="form-group">
              <label htmlFor="currentPassword">
                Current Password
              </label>

              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={passwordChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">
                New Password
              </label>

              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={passwordChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={passwordChangeHandler}
              />
            </div>

            <div className="modal-actions">
              <button
                type="submit"
                className="primary-btn"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>

      </div>

    </DashboardLayout>
  );
}

export default SettingsPage;
