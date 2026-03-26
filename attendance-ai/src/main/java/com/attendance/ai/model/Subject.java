package com.attendance.ai.model;

import jakarta.persistence.*;

@Entity
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CHANGED from 'subjectName' to 'name' to perfectly match the React frontend
    private String name; 

    public Subject(){}

    public Long getId(){ return id; }

    public void setId(Long id){ this.id = id; }

    public String getName(){ return name; }

    public void setName(String name){
        this.name = name;
    }

}
