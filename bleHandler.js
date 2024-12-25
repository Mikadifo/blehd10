import { getDevice } from "./utils.js";

const BLE_UUID = 0xffe0;
const CHAR_UUID = 0xffe1;

const $log = document.getElementById("log-container");
const $connectBtn = document.getElementById("connect-btn");
const $disconnectBtn = document.getElementById("disconnect-btn");

export const connect = async () => {
  try {
    addLog("Searching devices...");

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [BLE_UUID] }],
    });

    addLog(`connecting to ${device.name}`);
    const server = await device.gatt.connect();
    addLog("connected");

    addLog("getting primary service");
    const service = await server.getPrimaryService(BLE_UUID);
    addLog("starting notifications");

    addLog("getting characteristic");
    const characteristic = await service.getCharacteristic(CHAR_UUID);

    addLog("starting notifications");
    await characteristic.startNotifications();
    characteristic.addEventListener("characteristicvaluechanged", (event) => {
      const value = new TextDecoder().decode(event.target.value);
      addLog(`Received: ${value}`);
    });

    addLog("Ready to send data.");
    $connectBtn.setAttribute("disabled", true);
    $disconnectBtn.removeAttribute("disabled");
  } catch (error) {
    addLog(error.message, "error");
  }
};
export const disconnect = async () => {
  const device = getDevice();
  if (device != null && device.gatt.connected) {
    addLog("disconnecting...");
    device.gatt.disconnect();
    addLog("disconnected");
    $disconnectBtn.setAttribute("disabled", true);
    $connectBtn.removeAttribute("disabled");
  }
};

export const sendMessage = async (message) => {
  const device = getDevice();

  if (device == null || !device.gatt.connected) {
    addLog("Device not connected", "error");
    return;
  }

  const $sendButton = document.getElementById("send-btn");
  const $commandInput = document.getElementById("command-input");

  try {
    addLog(`Sending ${command}`, "info");
    const encodedData = new TextEncoder().encode(message);

    if (encodedData.byteLength >= 20) {
      throw new Error("Message exceeds BLE write limit of 20 bytes");
    }

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

window.connect = connect;
window.disconnect = disconnect;
