package com.attendance.ai.service;

import okhttp3.*;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit; // ⏳ Added to handle the timeouts!

@Service
public class AiService {

    private static final String API_KEY = "AIzaSyDRL9pOJ17WrOevXKS85xBX5AdVqWnQJDI";

    public String askAI(String message) throws Exception {

        // ⏳ UPDATE: Giving Gemini up to 60 seconds to "think" before throwing an error.
        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .build();

        String json = """
        {
        "contents":[
        {
        "parts":[
        {"text":"%s"}
        ]
        }
        ]
        }
        """.formatted(message);

        Request request = new Request.Builder()
                .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY)
                .addHeader("Content-Type","application/json")
                .post(RequestBody.create(json, MediaType.parse("application/json")))
                .build();

        Response response = client.newCall(request).execute();

        return response.body().string();

    }

}
