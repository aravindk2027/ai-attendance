import { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";
import Modal from "./Modal";
import { DataContext } from "../context/DataContext";
import "../styles/style.css";


function StudentDashboard() {
  const { currentUser, subjects, attendance, getStudentStats, getSubjectAttendanceForStudent, timetable, logout, submitReason } = useContext(DataContext);
  const navigate = useNavigate();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [selectedDayInfo, setSelectedDayInfo] = useState({ date: null, dayName: "" });
  const [expandedClassIdx, setExpandedClassIdx] = useState(null);
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [reasonInput, setReasonInput] = useState("");
  const [subjectReasonInputs, setSubjectReasonInputs] = useState({});

  // Guard: if no user is logged in, push to login
  if (!currentUser) return <Navigate to="/" />;

  // Dynamic Data
  const stats = getStudentStats(currentUser.id);
  const enrolledSubjectsCount = subjects.length;

  const handleDateClick = (dayName, dateObj) => {
    setSelectedDayInfo({ date: dateObj, dayName });
    setExpandedClassIdx(null); // Reset expansion on new day click
    setShowScheduleModal(true);
  };

  const getAttendanceForClassOnDate = (subjectName, dateObj) => {
    if (!dateObj) return null;

    // Find matching subject ID
    const subject = subjects.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
    if (!subject) return null;

    // Format date to YYYY-MM-DD
    const localDate = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000));
    const dateString = localDate.toISOString().split('T')[0];

    // Look up attendance record
    const record = attendance.find(r =>
      String(r.studentId) === String(currentUser.id) &&
      String(r.subjectId) === String(subject.id) &&
      r.date === dateString
    );

    return record; // Return raw record or undefined, handle fallback in the render method instead
  };

  const handleReasonSubmit = (subjectName, dateObj) => {
    if (!reasonInput.trim()) return;
    const subject = subjects.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
    const localDate = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000));
    const dateString = localDate.toISOString().split('T')[0];

    submitReason(currentUser.id, subject.id, dateString, reasonInput);
    setReasonInput(""); // clear input after submit
  };

  const handleSubjectReasonSubmit = (subjectId, dateStr) => {
    const reason = subjectReasonInputs[`${subjectId}-${dateStr}`];
    if (!reason || !reason.trim()) return;
    submitReason(currentUser.id, subjectId, dateStr, reason);
    setSubjectReasonInputs(prev => ({ ...prev, [`${subjectId}-${dateStr}`]: "" }));
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <Sidebar
        role="student"
        onLinkClick={(label) => {
          if (label === "Subjects") setShowSubjectsModal(true);
          else alert(`${label} feature coming soon!`);
        }}
        onDateClick={handleDateClick}
      />

      <div className="dashboard-content-wrapper">
        <div className="dashboard-header animate-slide-up">
          <div>
            <h1 className="dashboard-title" style={{ fontSize: "36px", background: "linear-gradient(135deg, var(--text-main), var(--primary-dark))", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Welcome, {currentUser.name}! 👋
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: "8px", fontSize: "16px" }}>
              Here's your attendance overview for this semester.
            </p>
          </div>
          <div className="header-actions">
            <button className="logout-btn" onClick={() => { logout(); navigate("/"); }} style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "12px 24px", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.2)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}>
              🚪 Wait, Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass-card stat-card stat-primary">
            <div className="stat-header">
              <span>Total Subjects</span>
              <div className="stat-icon" style={{ fontSize: "24px" }}>📚</div>
            </div>
            <div className="stat-value">{enrolledSubjectsCount}</div>
          </div>

          <div className="glass-card stat-card stat-warning">
            <div className="stat-header">
              <span>Overall Attendance</span>
              <div className="stat-icon" style={{ fontSize: "24px" }}>📊</div>
            </div>
            <div className="stat-value">{stats.overallPercentage}%</div>
          </div>

          <div className="glass-card stat-card stat-success">
            <div className="stat-header">
              <span>Classes Attended</span>
              <div className="stat-icon" style={{ fontSize: "24px" }}>✅</div>
            </div>
            <div className="stat-value">{stats.classesAttended}</div>
          </div>

          <div className="glass-card stat-card stat-danger">
            <div className="stat-header">
              <span>Classes Missed</span>
              <div className="stat-icon" style={{ fontSize: "24px" }}>❌</div>
            </div>
            <div className="stat-value">{stats.classesMissed}</div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="glass-card ai-insights-panel animate-slide-up" style={{ animationDelay: "0.2s", borderRadius: "24px", border: "1px solid rgba(147, 51, 234, 0.3)" }}>
          <div className="ai-content">
            <div className="ai-header" style={{ fontSize: "22px" }}>
              <span style={{ fontSize: "28px", filter: "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))" }}>✨</span>
              <span>AI Attendance Recommendation</span>
            </div>
            <div className="ai-text">
              <p>
                Your overall attendance is currently at <strong style={{ color: "var(--primary-dark)", fontSize: "18px" }}>{stats.overallPercentage}%</strong>.
              </p>
              {stats.overallPercentage >= 75 ? (
                <p style={{ background: "rgba(16, 185, 129, 0.1)", borderLeft: "4px solid var(--success)", padding: "12px", borderRadius: "8px", marginTop: "12px" }}>
                  <strong>Goal:</strong> You are doing great! Keep attending your classes to maintain this safe standing above the 75% threshold.
                </p>
              ) : (
                <p style={{ background: "rgba(239, 68, 68, 0.1)", borderLeft: "4px solid var(--danger)", padding: "12px", borderRadius: "8px", marginTop: "12px" }}>
                  <strong>Alert:</strong> You are below the required 75% threshold. Ensure you are present for the next upcoming sessions to bridge the gap.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="animate-slide-up" style={{ marginTop: "40px", animationDelay: "0.3s" }}>
          <h2 className="section-title">Subject Attendance Breakdown</h2>

          <div className="table-container glass-panel" style={{ padding: "4px" }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Attendance %</th>
                  <th>Classes Attended</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(subject => {
                  const data = getSubjectAttendanceForStudent(currentUser.id, subject.id);
                  let statusBadge = null;

                  if (data.total === 0) {
                    statusBadge = <span className="badge" style={{ background: "rgba(0,0,0,0.05)", color: "var(--text-muted)" }}>No Data</span>;
                  } else if (data.percentage >= 75) {
                    statusBadge = <span className="badge badge-success">Good</span>;
                  } else if (data.percentage >= 65) {
                    statusBadge = <span className="badge badge-warning">Close</span>;
                  } else {
                    statusBadge = <span className="badge badge-danger">Low</span>;
                  }

                  return (
                    <tr key={subject.id}>
                      <td>{subject.name}</td>
                      <td>{data.total > 0 ? `${data.percentage}%` : "N/A"}</td>
                      <td>{data.attended} / {data.total}</td>
                      <td>{statusBadge}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <Chatbot />

      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title={`Schedule for ${selectedDayInfo.dayName}`}>
        <div style={{ padding: "10px 0" }}>
          {selectedDayInfo.dayName && timetable[selectedDayInfo.dayName] && timetable[selectedDayInfo.dayName].length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {timetable[selectedDayInfo.dayName].map((cls, idx) => {
                const isExpanded = expandedClassIdx === idx;
                const record = isExpanded ? getAttendanceForClassOnDate(cls.subject, selectedDayInfo.date) : null;
                const attendanceStatus = record ? record.status : (isExpanded ? "Unmarked" : null);
                const submittedReason = record && record.reason ? record.reason : null;

                let badgeClass = "badge";
                if (attendanceStatus === "Present") badgeClass += " badge-success";
                else if (attendanceStatus === "Absent") badgeClass += " badge-danger";
                else badgeClass += " badge-warning"; // Unmarked

                return (
                  <div
                    key={idx}
                    style={{
                      padding: "16px",
                      background: isExpanded ? "rgba(79, 70, 229, 0.08)" : "rgba(79, 70, 229, 0.03)",
                      borderRadius: "12px",
                      borderLeft: "4px solid var(--primary)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div
                      onClick={() => {
                        setExpandedClassIdx(isExpanded ? null : idx);
                        setReasonInput("");
                      }}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--primary-dark)", marginBottom: "4px" }}>{cls.time}</div>
                        <div style={{ color: "var(--text-main)", fontWeight: 500 }}>{cls.subject}</div>
                      </div>
                      <div style={{ color: "var(--primary)", fontSize: "14px" }}>
                        {isExpanded ? "▲" : "▼"}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="animate-fade-in" style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                        <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "8px" }}>Attendance Status for {selectedDayInfo.date?.toLocaleDateString()}</div>
                        <div style={{ marginBottom: attendanceStatus === "Absent" ? "12px" : "0" }}>
                          {attendanceStatus === "Unmarked" ? (
                            <span className="badge" style={{ background: "rgba(0,0,0,0.05)", color: "var(--text-muted)" }}>Not Marked Yet</span>
                          ) : (
                            <span className={badgeClass}>{attendanceStatus} {record?.reasonApproved && "(Excused)"}</span>
                          )}
                        </div>

                        {/* Reason Input for Absences */}
                        {attendanceStatus === "Absent" && !record?.reasonApproved && (
                          <div style={{ marginTop: "12px", background: "rgba(239,68,68,0.05)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.2)" }}>
                            {submittedReason ? (
                              <div>
                                <strong style={{ color: "var(--danger)", fontSize: "14px" }}>Reason Submitted: </strong>
                                <span style={{ fontSize: "14px", color: "var(--text-main)" }}>{submittedReason}</span>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Pending admin review...</div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: "8px" }}>
                                <input
                                  type="text"
                                  placeholder="Provide fine valid reason..."
                                  value={reasonInput}
                                  onChange={(e) => setReasonInput(e.target.value)}
                                  className="form-input"
                                  style={{ flex: 1, padding: "8px", fontSize: "14px" }}
                                />
                                <button
                                  className="btn-primary"
                                  onClick={() => handleReasonSubmit(cls.subject, selectedDayInfo.date)}
                                  style={{ padding: "8px 16px", fontSize: "14px" }}
                                >
                                  Submit
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", textAlign: "center", margin: "20px 0" }}>No classes scheduled for this day.</p>
          )}
        </div>
        <button className="btn-primary" style={{ width: "100%", marginTop: "20px" }} onClick={() => setShowScheduleModal(false)}>
          <span>Close</span>
        </button>
      </Modal>

      <Modal isOpen={showSubjectsModal} onClose={() => setShowSubjectsModal(false)} title="My Enrolled Subjects">
        <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "8px" }}>
          {subjects.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {subjects.map(subject => {
                const data = getSubjectAttendanceForStudent(currentUser.id, subject.id);
                let badgeClass = "badge";
                let statusText = "No Data";

                if (data.total > 0) {
                  if (data.percentage >= 75) {
                    badgeClass += " badge-success";
                    statusText = "Good Standing";
                  } else if (data.percentage >= 65) {
                    badgeClass += " badge-warning";
                    statusText = "Needs Attention";
                  } else {
                    badgeClass += " badge-danger";
                    statusText = "Critical";
                  }
                } else {
                  badgeClass += " badge-warning"; // or default styling
                }

                const isExpanded = expandedSubjectId === subject.id;
                const studentAbsences = attendance.filter(r => r.studentId === currentUser.id && r.subjectId === subject.id && r.status === "Absent");

                return (
                  <div key={subject.id} className="glass-card" style={{ padding: "16px", borderRadius: "12px", borderLeft: "4px solid var(--primary)", cursor: "pointer", transition: "all 0.2s ease" }}
                    onClick={() => setExpandedSubjectId(isExpanded ? null : subject.id)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "16px" }}>{subject.name}</div>
                        <div style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>Classes Attended: {data.attended} / {data.total}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "20px", fontWeight: "bold", color: "var(--primary-dark)", marginBottom: "6px" }}>
                          {data.total > 0 ? `${data.percentage}%` : "N/A"}
                        </div>
                        <span className={badgeClass} style={{ fontSize: "12px", padding: "4px 8px" }}>
                          {statusText}
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="animate-fade-in" style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.05)" }} onClick={(e) => e.stopPropagation()}>
                        <h4 style={{ fontSize: "15px", color: "var(--primary-dark)", marginBottom: "12px" }}>Absence Records</h4>
                        {studentAbsences.length === 0 ? (
                          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Perfect attendance! No absences recorded.</p>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {studentAbsences.map((record, i) => (
                              <div key={i} style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                  <span style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "14px" }}>Date: {record.date}</span>
                                  <span className="badge badge-danger" style={{ fontSize: "12px" }}>Absent</span>
                                </div>

                                {record.reasonApproved ? (
                                  <div style={{ color: "var(--success)", fontSize: "13px", fontWeight: "600" }}>✓ Excused (Reason Approved)</div>
                                ) : record.reason ? (
                                  <div>
                                    <strong style={{ color: "var(--danger)", fontSize: "13px" }}>Reason Submitted: </strong>
                                    <span style={{ fontSize: "13px", color: "var(--text-main)" }}>{record.reason}</span>
                                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>Pending admin review...</div>
                                  </div>
                                ) : (
                                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                                    <input
                                      type="text"
                                      placeholder="Provide fine valid reason..."
                                      value={subjectReasonInputs[`${subject.id}-${record.date}`] || ""}
                                      onChange={(e) => setSubjectReasonInputs(prev => ({ ...prev, [`${subject.id}-${record.date}`]: e.target.value }))}
                                      className="form-input"
                                      style={{ flex: 1, padding: "6px 10px", fontSize: "13px" }}
                                    />
                                    <button
                                      className="btn-primary"
                                      onClick={() => handleSubjectReasonSubmit(subject.id, record.date)}
                                      style={{ padding: "6px 12px", fontSize: "13px" }}
                                    >
                                      Submit
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", textAlign: "center", margin: "20px 0" }}>You are not enrolled in any subjects.</p>
          )}
        </div>
        <button className="btn-secondary" style={{ width: "100%", marginTop: "20px" }} onClick={() => setShowSubjectsModal(false)}>
          <span>Close</span>
        </button>
      </Modal>
    </div>
  );
}

export default StudentDashboard;