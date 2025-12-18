(function () {
  const COLORS = {
    primary: "#2563eb",
    primaryDark: "#1e40af",
    secondary: "#06b6d4",
    background: "#f8fafc",
    surface: "#ffffff",
    border: "#e2e8f0",
    text: "#1e293b",
    textLight: "#64748b",
    success: "#10b981",
    successLight: "#d1fae5",
  };

  const STYLES = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    #chatbot-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      cursor: pointer;
      z-index: 99999;
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
      border: 2px solid white;
      transition: all 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    #chatbot-bubble:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 32px rgba(37, 99, 235, 0.4);
    }

    #chatbot-bubble svg {
      width: 26px;
      height: 26px;
    }

    #chatbot-bubble:active {
      transform: scale(0.95);
    }

    #chatbot-window {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 400px;
      max-height: 600px;
      background: ${COLORS.surface};
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    #chatbot-window.hidden {
      display: none;
    }

    .chatbot-header {
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
      padding: 16px 20px;
      color: white;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chatbot-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .chatbot-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .chatbot-tabs {
      display: flex;
      border-bottom: 1px solid ${COLORS.border};
      background: ${COLORS.background};
    }

    .chatbot-tab {
      flex: 1;
      padding: 12px 16px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-weight: 500;
      font-size: 13px;
      color: ${COLORS.textLight};
      transition: all 0.3s ease;
      border-bottom: 2px solid transparent;
      position: relative;
    }

    .chatbot-tab:hover {
      color: ${COLORS.text};
      background: rgba(37, 99, 235, 0.05);
    }

    .chatbot-tab.active {
      color: ${COLORS.primary};
      border-bottom-color: ${COLORS.primary};
      background: white;
    }

    .chatbot-section {
      flex: 1;
      display: none;
      flex-direction: column;
      overflow: hidden;
    }

    .chatbot-section.active {
      display: flex;
    }

    #chat-section {
      background: ${COLORS.background};
      padding: 0;
    }

    #chat-area {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message-box {
      display: flex;
      margin-bottom: 8px;
    }

    .message-box.user {
      justify-content: flex-end;
    }

    .message-bubble {
      max-width: 75%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
      word-wrap: break-word;
      white-space: pre-wrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message-bubble.user {
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
      color: white;
    }

    .message-bubble.bot {
      background: ${COLORS.border};
      color: ${COLORS.text};
    }

    .message-bubble.typing::after {
      content: '...';
      animation: typing 1.4s infinite;
    }

    @keyframes typing {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }

    .chat-input-group {
      padding: 12px;
      border-top: 1px solid ${COLORS.border};
      background: white;
      display: flex;
      gap: 8px;
    }

    #chat-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid ${COLORS.border};
      border-radius: 8px;
      font-size: 13px;
      font-family: inherit;
      transition: all 0.2s ease;
      resize: none;
      max-height: 60px;
    }

    #chat-input:focus {
      outline: none;
      border-color: ${COLORS.primary};
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    #chat-send {
      padding: 8px 16px;
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    #chat-send:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    #chat-send:active {
      transform: translateY(0);
    }

    #ticket-section {
      padding: 16px;
      background: ${COLORS.background};
      display: none;
      flex-direction: column;
    }

    #ticket-section.active {
      display: flex;
    }

    .ticket-label {
      font-weight: 600;
      font-size: 13px;
      color: ${COLORS.text};
      margin-bottom: 8px;
    }

    #ticket-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid ${COLORS.border};
      border-radius: 8px;
      font-size: 13px;
      font-family: inherit;
      resize: vertical;
      min-height: 100px;
      transition: all 0.2s ease;
    }

    #ticket-input:focus {
      outline: none;
      border-color: ${COLORS.primary};
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    #ticket-submit {
      margin-top: 12px;
      padding: 10px 16px;
      background: linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      transition: all 0.2s ease;
    }

    #ticket-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    #ticket-submit:active {
      transform: translateY(0);
    }

    /* Scrollbar styling */
    #chat-area::-webkit-scrollbar {
      width: 6px;
    }

    #chat-area::-webkit-scrollbar-track {
      background: transparent;
    }

    #chat-area::-webkit-scrollbar-thumb {
      background: ${COLORS.border};
      border-radius: 3px;
    }

    #chat-area::-webkit-scrollbar-thumb:hover {
      background: #cbd5e1;
    }

    @media (max-width: 480px) {
      #chatbot-window {
        width: calc(100vw - 32px);
        max-height: 70vh;
        bottom: 80px;
      }

      .message-bubble {
        max-width: 85%;
      }
    }
  `;

  // Inject styles
  const styleElement = document.createElement("style");
  styleElement.textContent = STYLES;
  document.head.appendChild(styleElement);

  // Create bubble
  const bubble = document.createElement("div");
  bubble.id = "chatbot-bubble";
  bubble.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M12 8V4H8"/>
      <rect width="16" height="12" x="4" y="8" rx="2"/>
      <path d="M2 14h2"/>
      <path d="M20 14h2"/>
      <path d="M15 13v2"/>
      <path d="M9 13v2"/>
    </svg>
`;
  document.body.appendChild(bubble);

  // Create window
  const windowBox = document.createElement("div");
  windowBox.id = "chatbot-window";
  windowBox.innerHTML = `
    <div class="chatbot-header">
      <span>AI Chatbot</span>
      <button class="chatbot-close">&times;</button>
    </div>

    <div class="chatbot-tabs">
      <button class="chatbot-tab active" data-tab="chat">Chat</button>
      <button class="chatbot-tab" data-tab="ticket">Raise Ticket</button>
    </div>

    <div id="chat-section" class="chatbot-section active">
      <div id="chat-area"></div>
      <div class="chat-input-group">
        <input
          id="chat-input"
          type="text"
          placeholder="Ask something..."
          autocomplete="off"
        />
        <button id="chat-send">Send</button>
      </div>
    </div>

    <div id="ticket-section" class="chatbot-section">
      <label class="ticket-label">Describe your issue</label>
      <textarea id="ticket-input" placeholder="Please provide details about your issue..."></textarea>
      <button id="ticket-submit">Raise Ticket</button>
    </div>
  `;
  document.body.appendChild(windowBox);

  // Elements
  const chatArea = document.getElementById("chat-area");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");
  const ticketInput = document.getElementById("ticket-input");
  const ticketSubmit = document.getElementById("ticket-submit");
  const chatSection = document.getElementById("chat-section");
  const ticketSection = document.getElementById("ticket-section");
  const tabs = document.querySelectorAll(".chatbot-tab");
  const closeBtn = document.querySelector(".chatbot-close");
  // 🔑 Extract widget owner userId from script URL
  const scriptTag = document.currentScript;
  const widgetUserId = new URL(scriptTag.src).searchParams.get("id");


  // Toggle window
  bubble.addEventListener("click", () => {
    windowBox.style.display = windowBox.style.display === "flex" ? "none" : "flex";
  });

  // Close button
  closeBtn.addEventListener("click", () => {
    windowBox.style.display = "none";
  });

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      document.querySelectorAll(".chatbot-section").forEach(section => {
        section.classList.remove("active");
      });

      if (tabName === "chat") {
        chatSection.classList.add("active");
        chatInput.focus();
      } else {
        ticketSection.classList.add("active");
        ticketInput.focus();
      }
    });
  });

  // Append message
  function appendMessage(sender, text) {
    const box = document.createElement("div");
    box.className = `message-box ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${sender}`;
    bubble.textContent = text;

    box.appendChild(bubble);
    chatArea.appendChild(box);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // Send message
  async function sendMessage() {
    const question = chatInput.value.trim();
    if (!question) return;

    appendMessage("user", question);
    chatInput.value = "";

    const typingBubble = document.createElement("div");
    typingBubble.className = "message-box bot";
    const bubble = document.createElement("div");
    bubble.className = "message-bubble bot typing";
    bubble.id = "typing-indicator";
    typingBubble.appendChild(bubble);
    chatArea.appendChild(typingBubble);
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
      const res = await fetch("http://localhost:4000/chatbot/ask-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ question, widgetUserId }),
      });

      const data = await res.json();

      typingBubble.remove();
      appendMessage("bot", data.answer || "No response found.");
    } catch (err) {
      typingBubble.remove();
      appendMessage("bot", "Server error. Please try again.");
    }
  }

  // Event listeners
  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Ticket submit
  ticketSubmit.addEventListener("click", async () => {
    const issue = ticketInput.value.trim();
    if (!issue) {
      alert("Please describe the issue.");
      return;
    }

    try {
      ticketSubmit.disabled = true;
      ticketSubmit.textContent = "Submitting...";

      const res = await fetch("http://localhost:4000/tickets/widget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ widgetUserId, issue }),
      });

      if (res.ok) {
        ticketInput.value = "";
        alert("Your ticket has been raised. We will contact you in 2–3 business days.");
      } else {
        throw new Error("Failed to submit ticket");
      }
    } catch (err) {
      alert("Could not raise ticket. Try again.");
    } finally {
      ticketSubmit.disabled = false;
      ticketSubmit.textContent = "Raise Ticket";
    }
  });
})();
