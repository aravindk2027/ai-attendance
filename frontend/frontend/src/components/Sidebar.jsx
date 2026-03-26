import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DataContext } from "../context/DataContext";

function MiniCalendar({ onDateClick }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = today.toLocaleString("default", { month: "long" });
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="mini-calendar">
      <div className="cal-header-row">
        <strong>{monthName} {year}</strong>
      </div>
      <div className="cal-grid">
        {weekDays.map(d => <div key={`h-${d}`} className="cal-day-name">{d}</div>)}
        {blanks.map((_, i) => <div key={`b-${i}`} className="cal-day empty"></div>)}
        {days.map(d => {
          const isToday = d === today.getDate();
          return (
            <div 
              key={d} 
              className={`cal-day ${isToday ? "today" : ""}`}
              onClick={() => {
                const dateObj = new Date(year, month, d);
                if (onDateClick) onDateClick(dayNames[dateObj.getDay()], dateObj);
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({ role = "admin", onLinkClick, onDateClick }) {
  const { logout } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const adminLinks = [
    { path: "/admin", icon: "🏠", label: "Dashboard" },
    { path: "#", icon: "📅", label: "Timetable" },
    { path: "#", icon: "📚", label: "Subjects" },
    { path: "#", icon: "👨‍🎓", label: "Students" },
    { path: "#", icon: "📝", label: "Attendance" },
    { path: "#", icon: "📊", label: "Reports" },
    { path: "#", icon: "🤖", label: "AI Insights" },
  ];

  const studentLinks = [
    { path: "/student", icon: "🏠", label: "Dashboard" },
    { path: "#", icon: "📊", label: "My Attendance" },
    { path: "#", icon: "📚", label: "Subjects" },
    { path: "#", icon: "🤖", label: "AI Assistant" },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <div className="app-sidebar glass-panel">
      <div className="sidebar-logo">
        <span>🤖</span>
        <span>AI Attendance</span>
      </div>

      <div className="sidebar-nav">
        {links.map((link, index) => {
          const isActive = location.pathname === link.path;
          return (
            <div
              key={index}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => {
                if (link.path !== "#") {
                  navigate(link.path);
                } else if (onLinkClick) {
                  onLinkClick(link.label);
                }
              }}
            >
              <span className="nav-item-icon">{link.icon}</span>
              <span>{link.label}</span>
            </div>
          );
        })}
      </div>

      {role === "student" && (
        <div style={{ marginTop: "auto", marginBottom: "20px", padding: "0 20px" }}>
          <MiniCalendar onDateClick={onDateClick} />
        </div>
      )}

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-item-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;