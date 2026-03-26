package com.attendance.ai.model;

import jakarta.persistence.*;

@Entity
public class Attendance {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private Long studentId;
private Long subjectId;

private String status; // Present or Absent

public Attendance(){}

public Long getId(){ return id; }

public void setId(Long id){ this.id = id; }

public Long getStudentId(){ return studentId; }

public void setStudentId(Long studentId){
this.studentId = studentId;
}

public Long getSubjectId(){ return subjectId; }

public void setSubjectId(Long subjectId){
this.subjectId = subjectId;
}

public String getStatus(){ return status; }

public void setStatus(String status){
this.status = status;
}

}