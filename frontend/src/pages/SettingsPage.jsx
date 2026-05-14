import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import API from "../services/api";

const passwordRuleMessage =
  "Password must be more than 6 characters and include one uppercase letter and one symbol.";

const isValidPassword = (password) =>
  password.length > 6 &&
  /[A-Z]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);


function SettingsPage() {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const [settings, setSettings] =
    useState({
      maintenanceMode: false,
    });

  const [profileForm, setProfileForm] =
    useState({
      name: userInfo?.name || "",
      email: userInfo?.email || "",
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
        maintenanceMode:
          data.maintenanceMode ?? false,
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
        maintenanceMode: data.maintenanceMode,
      });

      showToast("Settings saved successfully.");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Settings could not be saved."
      );
    }
  };


  const profileChangeHandler = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };


  const saveProfileHandler = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const { data } = await API.put(
        "/users/profile",
        profileForm,
        config
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      setProfileForm({
        name: data.name,
        email: data.email,
      });

      showToast("Admin profile updated.");

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Profile could not be updated."
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

    if (!isValidPassword(passwordForm.newPassword)) {
      setError(passwordRuleMessage);
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
            Update admin account details, password, and
            maintenance rules.
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
            Admin Account
          </div>

          <form
            className="project-form"
            onSubmit={saveProfileHandler}
          >
            <div className="form-group">
              <label htmlFor="name">
                Admin Name
              </label>

              <input
                id="name"
                name="name"
                value={profileForm.name}
                onChange={profileChangeHandler}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Admin Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={profileForm.email}
                onChange={profileChangeHandler}
              />
            </div>

            <div className="modal-actions">
              <button
                type="submit"
                className="primary-btn"
              >
                Save Account
              </button>
            </div>
          </form>
        </div>

        <div className="panel">
          <div className="panel-title">
            System Rules
          </div>

          <form
            className="project-form"
            onSubmit={saveSettingsHandler}
          >
            <label className="settings-toggle">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={settingsChangeHandler}
              />
              <span>
                Maintenance mode
              </span>
            </label>

            {settings.maintenanceMode && (
              <div className="maintenance-note">
                Maintenance is on. New public
                registrations will show a maintenance
                message and will not be created.
              </div>
            )}

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
                required
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
                required
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
                required
                value={passwordForm.confirmPassword}
                onChange={passwordChangeHandler}
              />

              <p className="password-hint">
                More than 6 characters, one uppercase
                letter, and one symbol.
              </p>
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
