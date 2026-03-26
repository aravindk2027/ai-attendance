import { useState } from "react";
import "../styles/style.css";

function Chatbot() {

  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const currentInput = userInput;
    
    // 1. Immediately show user's message and clear the input field
    setMessages(prev => [...prev, { user: currentInput }]);
    setUserInput("");

    try {
      const response = await fetch("http://localhost:8081/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: currentInput })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const jsonResponse = await response.json();
      
      // Extract the actual text string from the Gemini Response JSON
      // Optional chaining used to prevent crashes if the API returns an unexpected format
      const botText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

      // 2. Add the bot's response to the existing message in state
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = { ...newMessages[lastIndex], bot: botText };
        return newMessages;
      });

    } catch (error) {
      console.error("Chat error:", error);
      
      // 3. Show an error message if the backend fails or has CORS issues
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = { ...newMessages[lastIndex], bot: "Error: Could not connect to the backend server. Check terminal for details." };
        return newMessages;
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (

    <div>

      {/* Floating Button */}

      <div
        className="chatbot-button"
        onClick={() => setOpen(!open)}
      >
        💬
      </div>

      {/* Chat Window */}

      {open && (

        <div className="chatbot-window">

          <div className="chatbot-header">
            AI Attendance Assistant
          </div>

          <div className="chat-messages">

            {messages.map((msg, index) => (

              <div key={index} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {msg.user && (
                    <div className="user-message">
                      {msg.user}
                    </div>
                )}
                {msg.bot && (
                    <div className="ai-message">
                      {msg.bot}
                    </div>
                )}
              </div>

            ))}

          </div>

          <div className="chat-input">

            <input
              type="text"
              placeholder="Ask about attendance..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default Chatbot;