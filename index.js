import { sendMessage } from "./bleHandler.js";

const clearLogs = () =>
  (document.getElementById("log-container").innerHTML = "");

const submitMessage = (evt) => {
  evt.preventDefault();
  const data = new FormData(evt.target);
  const command = data.get("command");
  sendMessage(command);
};

window.clearLogs = clearLogs;
window.submitMessage = submitMessage;
