const BLE_UUID = 0xffe0;
const CHAR_UUID = 0xffe1;

let device = null;
let server = null;
let characteristic = null;

let $connectBtn = document.getElementById("connect-btn");
let $disconnectBtn = document.getElementById("disconnect-btn");
let $log = document.getElementById("log");
let $terminal = document.getElementById("terminal");

$connectBtn.addEventListener("click", async (evt) => {
  try {
    console.log("searching devices...");

    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [BLE_UUID] }],
    });

    console.log(`connecting to ${device.name}`);
    server = await device.gatt.connect();
    console.log("connected");

    console.log("getting primary service");
    const service = await server.getPrimaryService(BLE_UUID);
    console.log("starting notifications");

    console.log("getting characteristic");
    characteristic = await service.getCharacteristic(CHAR_UUID);

    console.log("starting notifications");
    await characteristic.startNotifications();
    characteristic.addEventListener("characteristicvaluechanged", (event) => {
      const value = new TextDecoder().decode(event.target.value);
      console.log(`Received: ${value}`);
    });

    console.log("Ready to send data.");
  } catch (error) {
    console.log(error.message);
  }
});

$disconnectBtn.addEventListener("click", (evt) => {
  if (device != null && device.gatt.connected) {
    console.log("disconnecting...");
    device.gatt.disconnect();
    console.log("disconnected");
  }
});

$terminal.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  if (device != null && device.gatt.connected) {
    const data = new FormData(evt.target);
    const command = data.get("command");

    console.log("sending data...");
    console.log(command);

    try {
      const encodedData = new TextEncoder().encode(command);
      await characteristic.writeValue(encodedData);
    } catch (error) {
      console.log(error.message);
    }
  }
});
