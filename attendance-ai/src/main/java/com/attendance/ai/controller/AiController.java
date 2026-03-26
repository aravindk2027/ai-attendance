package com.attendance.ai.controller;

import com.attendance.ai.service.AiService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService){
        this.aiService = aiService;
    }

    @PostMapping(value = "/chat", consumes = "application/json")
    public String chat(@RequestBody Map<String, String> requestBody) throws Exception {
        String message = requestBody.get("message"); 
        return aiService.askAI(message);
    }
}
