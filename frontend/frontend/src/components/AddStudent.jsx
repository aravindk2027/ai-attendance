import { useState } from "react";

function AddStudent() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [roll, setRoll] = useState("");

    const submitStudent = async () => {

        console.log("🔥 Button Clicked");

        const student = {
            name: name,
            email: email,
            roll: roll
        };

        try {

            const response = await fetch("/users/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            });

            console.log("✅ Response:", response);

            alert("Student Added Successfully");

            setName("");
            setEmail("");
            setRoll("");

        } catch (error) {
            console.log("❌ Error:", error);
            alert("Error connecting to backend");
        }

    };

    return (

        <div className="form-container">

            <h2>Add Student</h2>

            <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Roll Number"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={submitStudent}>
                Add Student
            </button>

        </div>

    );

}

export default AddStudent;