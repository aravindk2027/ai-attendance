package com.attendance.ai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.attendance.ai.model.User;

public interface UserRepository extends JpaRepository<User, Long>{

User findByEmail(String email);

}