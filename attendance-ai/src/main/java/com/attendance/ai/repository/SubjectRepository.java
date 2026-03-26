package com.attendance.ai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.attendance.ai.model.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long>{

}