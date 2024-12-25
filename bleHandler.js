const BLE_UUID = 0xffe0;
const CHAR_UUID = 0xffe1;
const CHUNK_SIZE = 20;

let device = null;
let characteristic = null;

const $log = document.getElementById("log-container");
const $connectBtn = document.getElementById("connect-btn");
const $disconnectBtn = document.getElementById("disconnect-btn");

export const connect = async () => {
  try {
    addLog("Searching devices...");

    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [BLE_UUID] }],
    });

    addLog(`connecting to ${device.name}`);
    const server = await device.gatt.connect();
    addLog("connected");
    sessionStorage.setItem("device", device);

    addLog("getting primary service");
    const service = await server.getPrimaryService(BLE_UUID);
    addLog("starting notifications");

    addLog("getting characteristic");
    characteristic = await service.getCharacteristic(CHAR_UUID);
    sessionStorage.setItem("characteristic", characteristic);

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
  if (device != null && device.gatt.connected) {
    addLog("disconnecting...");
    device.gatt.disconnect();
    addLog("disconnected");
    $disconnectBtn.setAttribute("disabled", true);
    $connectBtn.removeAttribute("disabled");
  }
};

export const sendMessage = async (message) => {
  if (device == null || !device.gatt.connected) {
    addLog("Device not connected", "error");
    return;
  }

  try {
    addLog(`Sending ${message}`);
    const chunks = message.match(new RegExp(`.{1,${CHUNK_SIZE}}`, "g"));

    for (let chunk of chunks) {
      const encodedData = new TextEncoder().encode(chunk);
      await characteristic.writeValue(encodedData);
    }
    addLog(message, "sent");
  } catch (error) {
    addLog(error.message, "error");
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
