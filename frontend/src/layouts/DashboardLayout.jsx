import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {

  return (
    <div className="layout">

      <Sidebar />

      <div className="main-content">

        {children}

      </div>

    </div>
  );
}

export default DashboardLayout;