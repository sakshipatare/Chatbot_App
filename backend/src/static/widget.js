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
  windowBox.style.height = "450px";
  windowBox.style.background = "white";
  windowBox.style.borderRadius = "12px";
  windowBox.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  windowBox.style.display = "none";
  windowBox.style.flexDirection = "column";
  windowBox.style.overflow = "hidden";
  windowBox.style.zIndex = "99999";

  windowBox.innerHTML = `
    <div style="background:#2563eb; padding:12px; color:white; font-weight:600; font-size:16px; display:flex; justify-content:space-between;">
      <span>AI Chatbot</span>
    </div>

    <!-- Tabs -->
    <div style="display:flex; border-bottom:1px solid #ddd;">
      <button id="tab-chat" style="flex:1; padding:10px; border:none; background:#e5e7eb; cursor:pointer; font-weight:600;">
        Chat
      </button>
      <button id="tab-ticket" style="flex:1; padding:10px; border:none; background:white; cursor:pointer; font-weight:600;">
        Raise Ticket
      </button>
    </div>

    <!-- Chat Area -->
    <div id="chat-section" style="flex:1; overflow-y:auto; padding:10px; background:#f5f5f5;">
        <div id="chat-area"></div>

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
    </div>

    <!-- Ticket Form -->
    <div id="ticket-section" style="flex:1; display:none; padding:12px;">
        <label style="font-weight:600;">Describe your issue:</label>
        <textarea id="ticket-input" style="width:100%; height:120px; margin-top:8px; padding:8px; border-radius:8px; border:1px solid #ccc;"></textarea>

        <button id="ticket-submit" 
          style="margin-top:12px; width:100%; padding:10px; background:#2563eb; color:white; border:none; border-radius:8px; cursor:pointer;">
          Raise Ticket
        </button>
    </div>
  `;

  document.body.appendChild(windowBox);

  // ---- Toggle open/close ----
  bubble.onclick = () => {
    windowBox.style.display =
      windowBox.style.display === "none" ? "flex" : "none";
  };

  // ---- Tab Switching ----
  const chatTab = document.getElementById("tab-chat");
  const ticketTab = document.getElementById("tab-ticket");
  const chatSection = document.getElementById("chat-section");
  const ticketSection = document.getElementById("ticket-section");

  chatTab.onclick = () => {
    chatSection.style.display = "block";
    ticketSection.style.display = "none";
    chatTab.style.background = "#e5e7eb";
    ticketTab.style.background = "white";
  };

  ticketTab.onclick = () => {
    chatSection.style.display = "none";
    ticketSection.style.display = "block";
    ticketTab.style.background = "#e5e7eb";
    chatTab.style.background = "white";
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
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

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

  // ---- Ticket Submit Logic ----
  const ticketBtn = document.getElementById("ticket-submit");
  const ticketInput = document.getElementById("ticket-input");

  ticketBtn.onclick = async () => {
    const issue = ticketInput.value.trim();
    if (!issue) return alert("Please describe the issue.");

    try {
      const res = await fetch("http://localhost:4000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ issue }),
      });

      ticketInput.value = "";
      alert("Your ticket has been raised. We will contact you in 2–3 business days.");

    } catch (err) {
      alert("Could not raise ticket. Try again.");
    }
  };
})();
