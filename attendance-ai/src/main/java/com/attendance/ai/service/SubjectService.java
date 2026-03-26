package com.attendance.ai.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.attendance.ai.model.Subject;
import com.attendance.ai.repository.SubjectRepository;

@Service
public class SubjectService {

@Autowired
private SubjectRepository repo;

public Subject addSubject(Subject subject){
return repo.save(subject);
}

public List<Subject> getAllSubjects(){
return repo.findAll();
}

}
