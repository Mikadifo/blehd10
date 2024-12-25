import { sendMessage } from "./bleHandler.js";

const clearLogs = () =>
  (document.getElementById("log-container").innerHTML = "");

const submitMessage = (evt) => {
  evt.preventDefault();
  const data = new FormData(evt.target);
  const command = data.get("command");
  const $commandInput = document.getElementById("command-input");
  const $sendButton = document.getElementById("send-btn");

  $sendButton.innerHTML = "Sending...";
  sendMessage(command);
  $commandInput.value = "";
  $sendButton.innerHTML = "Send";
};

window.clearLogs = clearLogs;
window.submitMessage = submitMessage;
