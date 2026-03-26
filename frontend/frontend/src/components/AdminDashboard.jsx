import { useState, useContext } from "react";
import Sidebar from "./Sidebar";
import Modal from "./Modal";
import { DataContext } from "../context/DataContext";
import "../styles/style.css";

function AdminDashboard() {
  const { students, subjects, attendance, addStudent, addSubject, markAttendance, timetable, updateTimetable, approveReason } = useContext(DataContext);

  // Modal States
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showViewRecordsModal, setShowViewRecordsModal] = useState(false);

  // Local state for Timetable editing
  const [editTimetable, setEditTimetable] = useState(null);

  // Form States
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  
  const [subjectName, setSubjectName] = useState("");

  const [attStudentId, setAttStudentId] = useState("");
  const [attSubjectId, setAttSubjectId] = useState("");
  const [attDate, setAttDate] = useState("");
  const [attStatus, setAttStatus] = useState("Present");

  // View Records States
  const [viewRecordStudentId, setViewRecordStudentId] = useState("");
  const [viewRecordSubjectId, setViewRecordSubjectId] = useState("");

  // Handlers
  const handleAddStudent = (e) => {
    e.preventDefault();
    addStudent({ name: studentName, email: studentEmail, password: studentPassword });
    setShowStudentModal(false);
    setStudentName("");
    setStudentEmail("");
    setStudentPassword("");
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    addSubject(subjectName);
    setShowSubjectModal(false);
    setSubjectName("");
  };

  const handleMarkAttendance = (e) => {
    e.preventDefault();
    if (!attStudentId || !attSubjectId || !attDate) return;
    markAttendance(attStudentId, attSubjectId, attDate, attStatus);
    setShowAttendanceModal(false);
    setAttStudentId("");
    setAttSubjectId("");
    setAttDate("");
    setAttStatus("Present");
  };

  const openTimetableEditor = () => {
    // Clone current timetable for local editing
    setEditTimetable(JSON.parse(JSON.stringify(timetable)));
    setShowTimetableModal(true);
  };

  const handleApproveReason = (studentId, subjectId, date) => {
    if (approveReason) {
      approveReason(studentId, subjectId, date);
    }
  };

  const handleSaveTimetable = (e) => {
    e.preventDefault();
    Object.keys(editTimetable).forEach(day => {
      updateTimetable(day, editTimetable[day]);
    });
    setShowTimetableModal(false);
  };

  const addClassEntry = (day) => {
    setEditTimetable(prev => ({
      ...prev,
      [day]: [...prev[day], { time: "", subject: "" }]
    }));
  };

  const updateClassEntry = (day, index, field, value) => {
    const updatedDay = [...editTimetable[day]];
    updatedDay[index][field] = value;
    setEditTimetable(prev => ({
      ...prev,
      [day]: updatedDay
    }));
  };

  const removeClassEntry = (day, index) => {
    const updatedDay = [...editTimetable[day]];
    updatedDay.splice(index, 1);
    setEditTimetable(prev => ({
      ...prev,
      [day]: updatedDay
    }));
  };

  // Safe Math for Average
  let averageAttendance = 0;
  if (attendance.length > 0) {
    const presentCount = attendance.filter(r => r.status === "Present").length;
    averageAttendance = Math.round((presentCount / attendance.length) * 100);
  }

  // Count low attendance globally (mock simple logic)
  let lowAttendanceCount = 0;
  students.forEach(s => {
    const sRecords = attendance.filter(r => String(r.studentId) === String(s.id));
    if (sRecords.length > 0) {
      const pCount = sRecords.filter(r => r.status === "Present").length;
      if ((pCount / sRecords.length) < 0.75) lowAttendanceCount++;
    }
  });

  // Get unapproved absences with reasons
  const absencesWithReasons = attendance.filter(r => r.status === "Absent" && r.reason && !r.reasonApproved);

  // Filtered attendance for View Records
  const viewedRecords = attendance.filter(r => 
    String(r.studentId) === String(viewRecordStudentId) && 
    String(r.subjectId) === String(viewRecordSubjectId)
  );

  return (
    <div className="dashboard-layout animate-fade-in">
      <Sidebar role="admin" onLinkClick={(label) => {
        if (label === "Subjects") setShowSubjectModal(true);
        else if (label === "Students") setShowStudentModal(true);
        else if (label === "Attendance") setShowAttendanceModal(true);
        else if (label === "Timetable") openTimetableEditor();
        else alert(`${label} feature coming soon!`);
      }} />

      <div className="dashboard-content-wrapper">
        <div className="dashboard-header animate-slide-up">
          <div>
            <h1 className="dashboard-title" style={{ fontSize: "36px", background: "linear-gradient(135deg, var(--text-main), var(--primary-dark))", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Admin Dashboard
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: "8px", fontSize: "16px" }}>
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => alert("Settings coming soon!")}>⚙️ Settings</button>
            <button className="btn-primary" onClick={() => setShowAttendanceModal(true)}>
              <span>+ New Session</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass-card stat-card stat-primary">
            <div className="stat-header">
              <span>Total Students</span>
              <div className="stat-icon" style={{ fontSize: "24px" }}>👨‍🎓</div>
            </div>
            <div className="stat-value">{students.length}</div>
          </div>

          <div className="glass-card stat-card stat-success">
            <div className="stat-header">
              <span>Active Subjects</span>
              <div className="stat-icon" style={{ fontSize: "24px" }}>📚</div>
            </div>
            <div className="stat-value">{subjects.length}</div>
          </div>

          <div className="glass-card stat-card stat-danger">
            <div className="stat-header">
              <span>Low Attendance</span>
              <div className="stat-icon" style={{ fontSize: "24px" }}>⚠️</div>
            </div>
            <div className="stat-value">{lowAttendanceCount}</div>
          </div>

          <div className="glass-card stat-card stat-warning">
            <div className="stat-header">
              <span>Average Attendance</span>
              <div className="stat-icon" style={{ fontSize: "24px" }}>📊</div>
            </div>
            <div className="stat-value">{averageAttendance}%</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-panel animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-row">
            <button className="action-btn" onClick={() => setShowSubjectModal(true)}>
              <span style={{ fontSize: "20px" }}>➕</span> Add Subject
            </button>
            <button className="action-btn" onClick={() => setShowStudentModal(true)}>
              <span style={{ fontSize: "20px" }}>👨‍🎓</span> Add Student
            </button>
            <button className="action-btn" onClick={() => setShowAttendanceModal(true)}>
              <span style={{ fontSize: "20px" }}>📝</span> Mark Attendance
            </button>
            <button className="action-btn" onClick={() => setShowReviewModal(true)} style={{ position: "relative" }}>
              <span style={{ fontSize: "20px" }}>🔍</span> Review Absences
              {absencesWithReasons.length > 0 && (
                <span style={{ position: "absolute", top: "8px", right: "8px", background: "var(--danger)", color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>
                  {absencesWithReasons.length}
                </span>
              )}
            </button>
            <button className="action-btn" onClick={() => setShowViewRecordsModal(true)}>
              <span style={{ fontSize: "20px" }}>📋</span> View & Edit Records
            </button>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="glass-card ai-insights-panel animate-slide-up" style={{ animationDelay: "0.3s", borderRadius: "24px", border: "1px solid rgba(147, 51, 234, 0.3)" }}>
          <div className="ai-content">
            <div className="ai-header" style={{ fontSize: "22px" }}>
              <span style={{ fontSize: "28px", filter: "drop-shadow(0 0 8px rgba(147, 51, 234, 0.5))" }}>✨</span>
              <span>AI Insights & Recommendations</span>
            </div>
            <div className="ai-text">
              <p style={{ background: "rgba(239, 68, 68, 0.1)", borderLeft: "4px solid var(--danger)", padding: "12px", borderRadius: "8px", marginBottom: "12px" }}>
                <strong>Alert:</strong> {lowAttendanceCount} student(s) are currently below the required 75% attendance threshold.
              </p>
              <p style={{ background: "rgba(79, 70, 229, 0.1)", borderLeft: "4px solid var(--primary)", padding: "12px", borderRadius: "8px", marginBottom: "12px" }}>
                <strong>Recommendation:</strong> Suggest reviewing attendance patterns and potentially scheduling a makeup class for affected students.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* MODALS */}
      <Modal isOpen={showStudentModal} onClose={() => setShowStudentModal(false)} title="Add New Student">
        <form onSubmit={handleAddStudent}>
          <div className="input-group">
            <label>Student Name</label>
            <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Email (Login credentials)</label>
            <input type="email" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="text" value={studentPassword} onChange={e => setStudentPassword(e.target.value)} placeholder="Auto-generated or type one" required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%" }}><span>Create Student</span></button>
        </form>
      </Modal>

      <Modal isOpen={showSubjectModal} onClose={() => setShowSubjectModal(false)} title="Add New Subject">
        <form onSubmit={handleAddSubject}>
          <div className="input-group">
            <label>Subject Name</label>
            <input type="text" value={subjectName} onChange={e => setSubjectName(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%" }}><span>Create Subject</span></button>
        </form>
      </Modal>

      <Modal isOpen={showAttendanceModal} onClose={() => setShowAttendanceModal(false)} title="Mark Attendance">
        <form onSubmit={handleMarkAttendance}>
          <div className="input-group">
            <label>Date</label>
            <input type="date" value={attDate} onChange={e => setAttDate(e.target.value)} required />
          </div>
          <div className="input-group" style={{ marginBottom: "16px" }}>
            <label>Subject</label>
            <select 
              value={attSubjectId} 
              onChange={e => setAttSubjectId(e.target.value)} 
              required
            >
              <option value="">-- Select Subject --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="input-group" style={{ marginBottom: "16px" }}>
            <label>Student</label>
            <select 
              value={attStudentId} 
              onChange={e => setAttStudentId(e.target.value)} 
              required
            >
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
            </select>
          </div>
          
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input type="radio" name="status" checked={attStatus === "Present"} onChange={() => setAttStatus("Present")} />
              Present
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input type="radio" name="status" checked={attStatus === "Absent"} onChange={() => setAttStatus("Absent")} />
              Absent
            </label>
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%" }}><span>Submit Attendance</span></button>
        </form>
      </Modal>

      <Modal isOpen={showTimetableModal} onClose={() => setShowTimetableModal(false)} title="Edit Weekly Timetable">
        <form onSubmit={handleSaveTimetable} style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "10px" }}>
          {editTimetable && Object.keys(editTimetable).map(day => (
            <div key={day} style={{ marginBottom: "20px", background: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: "var(--primary-dark)" }}>{day}</h3>
                <button type="button" className="btn-secondary" onClick={() => addClassEntry(day)} style={{ padding: "4px 10px", fontSize: "12px" }}>
                  + Slot
                </button>
              </div>
              
              {editTimetable[day].length === 0 ? (
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>No classes scheduled.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {editTimetable[day].map((cls, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "8px" }}>
                      <input 
                        type="text" 
                        placeholder="Time (e.g. 10:00 AM - 11:00 AM)" 
                        value={cls.time} 
                        onChange={e => updateClassEntry(day, idx, "time", e.target.value)}
                        required
                        style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.1)" }}
                      />
                      <input 
                        type="text" 
                        placeholder="Subject (e.g. AI)" 
                        value={cls.subject} 
                        onChange={e => updateClassEntry(day, idx, "subject", e.target.value)}
                        required
                        style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.1)" }}
                      />
                      <button type="button" onClick={() => removeClassEntry(day, idx)} style={{ background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", padding: "0 8px" }}>
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "16px" }}><span>Save Timetable</span></button>
        </form>
      </Modal>

      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Review Absence Reasons">
        <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "10px" }}>
          {absencesWithReasons.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>No pending absences to review.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {absencesWithReasons.map((record, idx) => {
                const student = students.find(s => String(s.id) === String(record.studentId));
                const subject = subjects.find(s => String(s.id) === String(record.subjectId));
                
                return (
                  <div key={idx} style={{ padding: "16px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "8px", borderLeft: "4px solid var(--danger)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{student?.name || "Unknown Student"}</div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>
                          {subject?.name || "Unknown Subject"} • {record.date}
                        </div>
                        <div style={{ background: "white", padding: "10px", borderRadius: "6px", fontSize: "14px", border: "1px solid rgba(0,0,0,0.05)" }}>
                          <strong>Reason:</strong> {record.reason}
                        </div>
                      </div>
                      <button 
                        className="btn-primary" 
                        style={{ padding: "6px 12px", fontSize: "13px", margin: 0 }}
                        onClick={() => handleApproveReason(record.studentId, record.subjectId, record.date)}
                      >
                         Approve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <button className="btn-secondary" style={{ width: "100%", marginTop: "20px" }} onClick={() => setShowReviewModal(false)}>Close</button>
      </Modal>

      <Modal isOpen={showViewRecordsModal} onClose={() => setShowViewRecordsModal(false)} title="View & Edit Student Records">
        <div style={{ marginBottom: "16px" }}>
          <div className="input-group" style={{ marginBottom: "12px" }}>
            <label>Select Student</label>
            <select value={viewRecordStudentId} onChange={e => setViewRecordStudentId(e.target.value)}>
              <option value="">-- Choose Student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Select Subject</label>
            <select value={viewRecordSubjectId} onChange={e => setViewRecordSubjectId(e.target.value)}>
              <option value="">-- Choose Subject --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div style={{ maxHeight: "50vh", overflowY: "auto", paddingRight: "10px" }}>
          {!viewRecordStudentId || !viewRecordSubjectId ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>Please select a student and subject.</p>
          ) : viewedRecords.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px" }}>No past records found for this student in this subject.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {viewedRecords.map((r, idx) => (
                <div key={idx} style={{ padding: "12px", background: "var(--bg-card)", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "14px", marginBottom: "4px" }}>{r.date}</div>
                    {r.reason && (
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        <strong>Reason:</strong> {r.reason} {r.reasonApproved && <span style={{ color: "var(--success)" }}>(Approved)</span>}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {r.status === "Absent" && r.reason && !r.reasonApproved && (
                      <button 
                        className="btn-primary" 
                        style={{ padding: "4px 8px", fontSize: "12px", margin: 0, background: "var(--primary)" }}
                        onClick={() => handleApproveReason(r.studentId, r.subjectId, r.date)}
                      >
                        Approve Reason
                      </button>
                    )}
                    <select 
                      value={r.status}
                      onChange={(e) => markAttendance(r.studentId, r.subjectId, r.date, e.target.value)}
                      style={{ 
                        padding: "4px 8px", 
                        fontSize: "12px", 
                        borderRadius: "6px",
                        border: r.status === "Present" ? "1px solid var(--success)" : "1px solid var(--danger)",
                        background: r.status === "Present" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: r.status === "Present" ? "var(--success)" : "var(--danger)",
                        fontWeight: "bold",
                        outline: "none",
                        cursor: "pointer"
                      }}
                    >
                      <option value="Present" style={{ color: "var(--text-main)" }}>Present</option>
                      <option value="Absent" style={{ color: "var(--text-main)" }}>Absent</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="btn-secondary" style={{ width: "100%", marginTop: "20px" }} onClick={() => setShowViewRecordsModal(false)}>Close</button>
      </Modal>

    </div>
  );
}

export default AdminDashboard;