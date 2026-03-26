import { createContext, useState, useEffect } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Try to load from local storage
  const loadState = (key, defaultVal) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  };

  const [currentUser, setCurrentUser] = useState(loadState("currentUser", null));
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const defaultTimetable = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  };
  const [timetable, setTimetable] = useState(loadState("timetable", defaultTimetable));

  // Fetch initial data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, subjectsRes, attendanceRes] = await Promise.all([
          fetch("/users/all"),
          fetch("/subjects/all"),
          fetch("/attendance/all")
        ]);

        if (usersRes.ok) setStudents(await usersRes.json());
        if (subjectsRes.ok) setSubjects(await subjectsRes.json());
        if (attendanceRes.ok) setAttendance(await attendanceRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Sync to local storage on change
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("timetable", JSON.stringify(timetable));
  }, [timetable]);

  // Actions
  const login = async (email, password, role) => {
    if (role === "admin") {
      if (email === "admin@test.com" && password === "admin123") {
        const adminUser = { id: 0, role: "admin", name: "Admin" };
        setCurrentUser(adminUser);
        return { success: true, user: adminUser };
      }
      return { success: false, message: "Invalid admin credentials (admin@test.com / admin123)" };
    } else {
      try {
        const response = await fetch("/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          return { success: true, user };
        } else {
          return { success: false, message: "Invalid student credentials" };
        }
      } catch (error) {
        return { success: false, message: "Error connecting to server" };
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addStudent = async (studentData) => {
    try {
      const response = await fetch("/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
      });
      if (response.ok) {
        const newStudent = await response.json();
        setStudents((prev) => [...prev, newStudent]);
        return newStudent;
      }
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const addSubject = async (subjectName) => {
    try {
      const response = await fetch("/subjects/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subjectName })
      });
      if (response.ok) {
        const newSubject = await response.json();
        setSubjects((prev) => [...prev, newSubject]);
        return newSubject;
      }
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const markAttendance = async (studentId, subjectId, date, status) => {
    try {
      const response = await fetch("/attendance/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, subjectId, status, date })
      });
      if (response.ok) {
        const newRecord = await response.json();
        setAttendance((prev) => {
          const existingIdx = prev.findIndex(r => String(r.studentId) === String(studentId) && String(r.subjectId) === String(subjectId) && r.date === date);
          if (existingIdx >= 0) {
            const updated = [...prev];
            updated[existingIdx] = newRecord;
            return updated;
          }
          return [...prev, newRecord];
        });
        return newRecord;
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const submitReason = (studentId, subjectId, date, reason) => {
    setAttendance((prev) => {
      const existingIdx = prev.findIndex(r => String(r.studentId) === String(studentId) && String(r.subjectId) === String(subjectId) && r.date === date);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], reason };
        return updated;
      }
      return prev;
    });
  };

  const approveReason = (studentId, subjectId, date) => {
    setAttendance((prev) => {
      const existingIdx = prev.findIndex(r => String(r.studentId) === String(studentId) && String(r.subjectId) === String(subjectId) && r.date === date);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], status: "Present", reasonApproved: true };
        return updated;
      }
      return prev;
    });
  };

  const updateTimetable = (day, classes) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: classes
    }));
  };

  // Helper to calculate student stats
  const getStudentStats = (studentId) => {
    const studentRecords = attendance.filter((r) => String(r.studentId) === String(studentId));
    const totalClassesHeld = attendance.length > 0 
      ? new Set(attendance.filter(r => String(r.studentId) === String(studentId)).map(r => r.date + r.subjectId)).size 
      : 0; // Rough approximation for this mock

    const classesAttended = studentRecords.filter((r) => r.status === "Present").length;
    const classesMissed = studentRecords.filter((r) => r.status === "Absent").length;
    
    // Better approximation for mock: count total distinct classes for *any* student to know how many classes were held total in enrolled subjects
    // For simplicity of this mock frontend, let's just use attended + missed as total held for that student
    const totalHeldForStudent = classesAttended + classesMissed;

    let overallPercentage = 0;
    if (totalHeldForStudent > 0) {
      overallPercentage = Math.round((classesAttended / totalHeldForStudent) * 100);
    }

    return {
      classesAttended,
      classesMissed,
      totalHeldForStudent,
      overallPercentage
    };
  };

  const getSubjectAttendanceForStudent = (studentId, subjectId) => {
    const records = attendance.filter((r) => String(r.studentId) === String(studentId) && String(r.subjectId) === String(subjectId));
    const attended = records.filter((r) => r.status === "Present").length;
    const total = records.length;
    let percentage = 0;
    if (total > 0) percentage = Math.round((attended / total) * 100);

    return { attended, total, percentage };
  };

  return (
    <DataContext.Provider
      value={{
        currentUser,
        students,
        subjects,
        attendance,
        login,
        logout,
        addStudent,
        addSubject,
        markAttendance,
        submitReason,
        approveReason,
        timetable,
        updateTimetable,
        getStudentStats,
        getSubjectAttendanceForStudent
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
