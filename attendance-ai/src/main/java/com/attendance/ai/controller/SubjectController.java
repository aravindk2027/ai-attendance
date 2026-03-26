package com.attendance.ai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.attendance.ai.model.Subject;
import com.attendance.ai.service.SubjectService;

@RestController
@RequestMapping("/subjects")
@CrossOrigin(origins = "http://localhost:5173")
public class SubjectController {

@Autowired
private SubjectService service;

@PostMapping("/add")
public Subject addSubject(@RequestBody Subject subject){
return service.addSubject(subject);
}

@GetMapping("/all")
public List<Subject> getSubjects(){
return service.getAllSubjects();
}

}