package com.attendance.ai.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.attendance.ai.service.AIRecommendationService;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    @Autowired
    private AIRecommendationService aiService;

    @GetMapping("/recommend")
    public String getRecommendation(
            @RequestParam String subject,
            @RequestParam int total,
            @RequestParam int attended) {

        return aiService.getRecommendation(subject, total, attended);
    }
}
