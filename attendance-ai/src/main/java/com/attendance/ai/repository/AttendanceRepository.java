package com.attendance.ai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.attendance.ai.model.Attendance;

public interface AttendanceRepository extends JpaRepository<Attendance, Long>{

}