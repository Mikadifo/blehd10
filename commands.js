import { sendMessage } from "./bleHandler.js";

const commands = [{ name: "Hello World", value: "Hello World!" }];

const $customCommands = document.getElementById("custom-commands");

const openCustomCommandForm = () => {
  document.getElementById("custom-commands-form").style.display = "block";
};

const closeCustomCommandForm = () => {
  document.getElementById("custom-commands-form").style.display = "none";
};

const createCustomCommand = (evt) => {
  evt.preventDefault();
  const data = new FormData(evt.target);
  const commandName = data.get("command-name");
  const commandValue = data.get("command-value");

  if (commandFound) {
    addLog(`${commandName} already exists`, "error");
    return;
  }

  if (new TextEncoder().encode(commandValue).byteLength >= 20) {
    addLog("Command exceeds BLE write limit of 20 bytes", "error");
    return;
  }

  const commandFound = commands.filter(
    (command) => command.name === commandName
  )[0];

  commands.push({ name: commandName, value: commandValue });
  addLog(`${commandName} created`, "info");
};

const loadCommands = () => {
  const commandCards = commands.map((command) => {
    const commandButton = document.createElement("button");
    commandButton.innerText = command.name;
    commandButton.classList.add("command-card");
    commandButton.onclick = () => {
      sendMessage(command.value);
    };
  });
  $customCommands.innerHTML = commandCards.join("");
};

loadCommands();

window.openCustomCommandForm = openCustomCommandForm;
window.closeCustomCommandForm = closeCustomCommandForm;
window.createCustomCommand = createCustomCommand;
