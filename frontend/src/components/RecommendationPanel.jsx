import React, { useState } from "react";
import axios from "axios";

function RecommendationPanel() {

  const [studentName, setStudentName] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const getRecommendation = () => {

    axios.get(`http://localhost:8081/recommendation/${studentName}`)
    .then(response => {
      setRecommendation(response.data);
    })
    .catch(error => {
      console.log(error);
    });

  };

  return (

    <div>

      <h2>AI Attendance Recommendation</h2>

      <input
        type="text"
        placeholder="Enter Student Name"
        onChange={(e)=>setStudentName(e.target.value)}
      />

      <br/><br/>

      <button onClick={getRecommendation}>
        Get Recommendation
      </button>

      <h3>{recommendation}</h3>

    </div>

  );
}

export default RecommendationPanel;