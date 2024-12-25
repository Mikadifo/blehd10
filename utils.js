const $log = document.getElementById("log-container");

export const sendMessage = async (message, characteristic) => {
  const $sendButton = document.getElementById("send-btn");
  const $commandInput = document.getElementById("command-input");

  try {
    const encodedData = new TextEncoder().encode(message);

    if (encodedData.byteLength >= 20) {
      throw new Error("Message exceeds BLE write limit of 20 bytes");
    }

    $sendButton.innerHTML = "Sending...";
    await characteristic.writeValue(encodedData);
    $commandInput.value = "";
    addLog(command, "sent");
  } catch (error) {
    addLog(error.message, "error");
  } finally {
    $sendButton.innerHTML = "Send";
  }
};

export const addLog = (msg, type = "info") => {
  const logMsg = document.createElement("p");
  logMsg.innerText = `${type}: ${msg}`;
  logMsg.classList.add(`log-${type}`);
  $log.appendChild(logMsg);
};
