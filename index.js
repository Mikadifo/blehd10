const BLE_UUID = 0xffe0;
const CHAR_UUID = 0xffe1;

let device = null;
let server = null;
let characteristic = null;

let $connectBtn = document.getElementById("connect-btn");
let $disconnectBtn = document.getElementById("disconnect-btn");
let $clearBtn = document.getElementById("clear-btn");
let $log = document.getElementById("log-container");
let $terminal = document.getElementById("terminal");

$clearBtn.addEventListener("click", (evt) => {
  $log.innerHTML = "";
});

$connectBtn.addEventListener("click", async (evt) => {
  try {
    addLog("Searching devices...");

    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [BLE_UUID] }],
    });

    addLog(`connecting to ${device.name}`);
    server = await device.gatt.connect();
    addLog("connected");

    addLog("getting primary service");
    const service = await server.getPrimaryService(BLE_UUID);
    addLog("starting notifications");

    addLog("getting characteristic");
    characteristic = await service.getCharacteristic(CHAR_UUID);

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
    addLog(error.message);
  }
});

$disconnectBtn.addEventListener("click", (evt) => {
  if (device != null && device.gatt.connected) {
    addLog("disconnecting...");
    device.gatt.disconnect();
    addLog("disconnected");
    $disconnectBtn.setAttribute("disabled", true);
    $connectBtn.removeAttribute("disabled");
  }
});

$terminal.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  if (device != null && device.gatt.connected) {
    const $commandBtn = document.getElementById("command-btn");
    const data = new FormData(evt.target);
    const command = data.get("command");

    addLog(`Sending ${command}`);

    try {
      const encodedData = new TextEncoder().encode(command);
      $commandBtn.setValue("Sending...");
      await characteristic.writeValue(encodedData);
    } catch (error) {
      addLog(error.message);
    } finally {
      $commandBtn.setValue("Send");
    }
  } else {
    addLog("Device not connected");
  }
});

const addLog = (msg) => {
  const logMsg = document.createElement("p");
  logMsg.innerText = msg;
  $log.appendChild(logMsg);
};
