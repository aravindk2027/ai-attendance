package com.attendance.ai.service;

import org.springframework.stereotype.Service;

@Service
public class AIRecommendationService {

    public String getRecommendation(String subjectName, int totalClasses, int attendedClasses) {

        double percentage = ((double) attendedClasses / totalClasses) * 100;

        if (percentage >= 75) {
            return "Your attendance in " + subjectName + " is good.";
        }

        int classesNeeded = (int)Math.ceil((0.75 * totalClasses) - attendedClasses);

        return "Attend next " + classesNeeded + " classes in " + subjectName + " to reach 75% attendance.";
    }
}