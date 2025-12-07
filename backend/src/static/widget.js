(function () {
  const chatButton = document.createElement("div");
  chatButton.innerText = "💬";
  chatButton.style.position = "fixed";
  chatButton.style.bottom = "20px";
  chatButton.style.right = "20px";
  chatButton.style.background = "#007bff";
  chatButton.style.color = "#fff";
  chatButton.style.padding = "15px";
  chatButton.style.borderRadius = "50%";
  chatButton.style.cursor = "pointer";
  chatButton.style.fontSize = "22px";
  chatButton.style.zIndex = "9999";
  
  document.body.appendChild(chatButton);

  chatButton.onclick = function () {
    alert("Chatbot open UI will pop here");
  };
})();
