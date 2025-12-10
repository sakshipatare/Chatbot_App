(function () {
  // ---- Create Floating Button ----
  const bubble = document.createElement("div");
  bubble.id = "chatbot-bubble";
  bubble.style.position = "fixed";
  bubble.style.bottom = "20px";
  bubble.style.right = "20px";
  bubble.style.width = "60px";
  bubble.style.height = "60px";
  bubble.style.background = "#2563eb";
  bubble.style.borderRadius = "50%";
  bubble.style.display = "flex";
  bubble.style.alignItems = "center";
  bubble.style.justifyContent = "center";
  bubble.style.color = "white";
  bubble.style.fontSize = "30px";
  bubble.style.cursor = "pointer";
  bubble.style.zIndex = "99999";
  bubble.innerHTML = "💬";
  document.body.appendChild(bubble);

  // ---- Create Chat Window ----
  const windowBox = document.createElement("div");
  windowBox.id = "chatbot-window";
  windowBox.style.position = "fixed";
  windowBox.style.bottom = "90px";
  windowBox.style.right = "20px";
  windowBox.style.width = "320px";
  windowBox.style.height = "420px";
  windowBox.style.background = "white";
  windowBox.style.borderRadius = "12px";
  windowBox.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  windowBox.style.display = "none";
  windowBox.style.flexDirection = "column";
  windowBox.style.overflow = "hidden";
  windowBox.style.zIndex = "99999";

  windowBox.innerHTML = `
    <div style="background:#2563eb; padding:12px; color:white; font-weight:600; font-size:16px;">
      Chatbot Assistant
    </div>

    <div id="chat-area" style="flex:1; overflow-y:auto; padding:10px; background:#f5f5f5;"></div>

    <div style="padding:8px; border-top:1px solid #ddd;">
        <input 
          id="chat-input"
          type="text" 
          placeholder="Ask something..." 
          style="width:74%; padding:8px; border-radius:6px; border:1px solid #ccc; font-size:14px;"
        />
        <button id="chat-send" style="width:22%; padding:8px; background:#2563eb; color:white; border:none; border-radius:6px; cursor:pointer;">
          Send
        </button>
    </div>
  `;

  document.body.appendChild(windowBox);

  // ---- Toggle open/close ----
  bubble.onclick = () => {
    windowBox.style.display =
      windowBox.style.display === "none" ? "flex" : "none";
  };

  // ---- Chat Logic ----
  const sendBtn = document.getElementById("chat-send");
  const input = document.getElementById("chat-input");
  const chatArea = document.getElementById("chat-area");

  function appendMessage(sender, text) {
    const box = document.createElement("div");
    box.style.margin = "8px 0";
    box.style.display = "flex";
    box.style.justifyContent = sender === "user" ? "flex-end" : "flex-start";

    const bubble = document.createElement("div");
    bubble.style.maxWidth = "70%";
    bubble.style.padding = "8px 12px";
    bubble.style.borderRadius = "12px";
    bubble.style.fontSize = "14px";
    bubble.style.whiteSpace = "pre-wrap";
    bubble.style.wordBreak = "break-word";
    bubble.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    bubble.style.background = sender === "user" ? "#2563eb" : "#e5e7eb";
    bubble.style.color = sender === "user" ? "white" : "black";
    bubble.innerText = text;

    box.appendChild(bubble);
    chatArea.appendChild(box);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  async function sendMessage() {
    const question = input.value.trim();
    if (!question) return;

    appendMessage("user", question);
    input.value = "";

    appendMessage("bot", "Typing...");

    try {
      const res = await fetch("http://localhost:4000/chatbot/ask-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"), // IMPORTANT
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      // Remove "Typing..."
      chatArea.removeChild(chatArea.lastChild);

      appendMessage("bot", data.answer || "No response found.");
    } catch (err) {
      appendMessage("bot", "Server error. Try again.");
    }
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
