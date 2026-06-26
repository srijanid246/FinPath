import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Sidebar({ activePage }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = [
    { key: "dashboard", label: "Dashboard", path: "/dashboard" },
    { key: "strategy", label: "Financial Strategy", path: "/strategy" },
    { key: "simulator", label: "What-If Simulator", path: "/simulator" },
    { key: "coach", label: "AI Coach", path: "/coach" },
    { key: "analytics", label: "Analytics", path: "/analytics" },
    { key: "profile", label: "Profile", path: "/profile" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">FinPath</h2>

      <div className="sidebar-menu">
        {links.map((link) => (
          <div
            key={link.key}
            className={activePage === link.key ? "active-menu" : ""}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="user-info">
            <h4>{user ? `${user.first_name} ${user.last_name}` : "—"}</h4>
            <p>{user?.username || ""}</p>
          </div>
          <div className="logout-btn" onClick={logout}>
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;