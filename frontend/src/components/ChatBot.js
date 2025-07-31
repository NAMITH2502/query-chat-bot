import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const questions = [
  { field: "name", question: "What is the name?" },
  { field: "role", question: "What is the role?" },
  { field: "department", question: "Which department?" },
  { field: "email", question: "Email?" },
  { field: "phone", question: "Phone number?" },
];

const Chat = () => {
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm QueryBee. Your personalized Query Chatbot!",
    },
  ]);
  const [input, setInput] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
  });

  // inside Chat component
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setChat((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");

    // 👉 If currently in add-employee mode
    if (addMode) {
      const currentField = questions[step].field;
      const updatedForm = { ...form, [currentField]: userMessage };
      setForm(updatedForm);

      if (step < questions.length - 1) {
        const nextStep = step + 1;
        setStep(nextStep);
        setChat((prev) => [
          ...prev,
          { sender: "bot", text: questions[nextStep].question },
        ]);
      } else {
        try {
          await axios.post(
            "http://localhost:5000/api/employees/create",
            updatedForm
          );
          setChat((prev) => [
            ...prev,
            { sender: "bot", text: "🎉 Employee added successfully!" },
          ]);
        } catch {
          setChat((prev) => [
            ...prev,
            { sender: "bot", text: "❌ Error adding employee." },
          ]);
        }

        setAddMode(false);
        setStep(0);
        setForm({ name: "", role: "", department: "", email: "", phone: "" });
      }
      return;
    }

    // 🤖 creating
    if (/add.*employee/i.test(userMessage)) {
      setAddMode(true);
      setStep(0);
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: questions[0].question },
      ]);
      return;
    }

    // 🔍 querying
    if (userMessage.toLowerCase().includes("employee")) {
      const nameMatch = userMessage.match(/employee\s+(\w+)/i);
      const fieldMatch = userMessage.match(/(phone|email|role|department)/i);

      if (nameMatch && fieldMatch) {
        const name = nameMatch[1];
        const field = fieldMatch[1];

        try {
          const res = await axios.get(
            `http://localhost:5000/api/employees/search?name=${name}`
          );
          const value = res.data[field];

          if (value) {
            setChat((prev) => [
              ...prev,
              { sender: "bot", text: `${name}'s ${field} is: ${value}` },
            ]);
          } else {
            setChat((prev) => [
              ...prev,
              { sender: "bot", text: `No ${field} info found for ${name}.` },
            ]);
          }
        } catch {
          setChat((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `❌ Could not find employee named ${name}.`,
            },
          ]);
        }

        return;
      }
    }

    setChat((prev) => [
      ...prev,
      {
        sender: "bot",
        text: " ❓ I can add an employee or fetch their details. Try asking me!",
      },
    ]);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          💬 QueryBee{""}
          <p
            style={{
              fontSize: "18px",
            }}
          >
            🟢 I'm Online, shoot!
          </p>
        </div>

        <div style={styles.messages} ref={messagesEndRef}>
          {chat.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "0.6rem",
              }}
            >
              <div
                style={{
                  maxWidth: "100%",
                  padding: "0.6rem 1rem",
                  borderRadius: "20px",
                  background: msg.sender === "user" ? "#d1c4e9" : "#f1f1f1",
                  color: "#333",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.sendButton}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    background: "linear-gradient(to right, #f3e7fe, #e1d5fa)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    padding: "1rem",
    boxSizing: "border-box",
  },
  chatContainer: {
    width: "100%",
    maxWidth: "800px",
    height: "80%",
    background: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(to right, #7e57c2, #9575cd)",
    color: "#fff",
    padding: "1.5rem",
    fontWeight: "800",
    fontSize: "28px",
    textAlign: "center",
    display: "flex",
    justifyContent: "space-between",
  },
  messages: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto",
    height: "600px",
    backgroundColor: "#faf8ff",
    fontSize: "18px",
    maxHeight: "calc(100% - 150px)",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    borderTop: "1px solid #eee",
    padding: "0.75rem 1rem",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: "1rem 3rem",
    borderRadius: "25px",
    border: "1px solid #d1c4e9",
    outline: "none",
    fontSize: "24px",
    backgroundColor: "#f9f6ff",
  },
  sendButton: {
    marginLeft: "0.6rem",
    background: "linear-gradient(to right, #7e57c2, #9575cd)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
};

export default Chat;
