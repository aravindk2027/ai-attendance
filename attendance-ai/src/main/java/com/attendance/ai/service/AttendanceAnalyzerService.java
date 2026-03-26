package com.attendance.ai.service;

import org.springframework.stereotype.Service;

@Service
public class AttendanceAnalyzerService {

    public String analyzeAttendance(String subject, int totalClasses, int attendedClasses) {

        double percentage = ((double) attendedClasses / totalClasses) * 100;

        if (percentage >= 75) {
            return subject + " attendance is good (" + percentage + "%)";
        }

        int needed = (int)Math.ceil((0.75 * totalClasses) - attendedClasses);

        return subject + " attendance is low (" + percentage + "%). Attend next " 
               + needed + " classes to reach 75%.";
    }
}
