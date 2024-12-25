import { sendMessage, addLog } from "./bleHandler.js";

let commands = JSON.parse(localStorage.getItem("commands")) || [];

const $customCommands = document.getElementById("custom-commands");

const openCustomCommandForm = () => {
  document.getElementById("custom-commands-form").style.display = "block";
};

const closeCustomCommandForm = () => {
  const $customCommandsForm = document.getElementById("custom-commands-form");
  $customCommandsForm.style.display = "none";
  $customCommandsForm.getElementsByTagName("form")[0].reset(0);
};

const createCustomCommand = (evt) => {
  evt.preventDefault();
  const data = new FormData(evt.target);
  const commandName = data.get("command-name");
  const commandValue = data.get("command-value");

  const commandFound = commands.filter(
    (command) => command.name === commandName
  )[0];

  if (commandFound) {
    addLog(`${commandName} already exists`, "error");
    return;
  }

  commands.push({ name: commandName, value: commandValue });
  localStorage.setItem("commands", JSON.stringify(commands));
  addLog(`${commandName} created`, "info");
  evt.target.reset(0);
  closeCustomCommandForm();
  loadCommands();
};

const loadCommands = () => {
  $customCommands.innerHTML = "";

  commands.forEach((command) => {
    const commandCard = document.createElement("div");
    const commandButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    deleteButton.innerHTML = "X";
    deleteButton.classList.add("delete-command-button");
    commandButton.classList.add("execute-command-button");
    commandButton.innerHTML = command.name;

    commandCard.appendChild(commandButton);
    commandCard.appendChild(deleteButton);
    commandCard.classList.add("command-card");

    commandButton.onclick = () => {
      sendMessage(command.value);
    };

    deleteButton.onclick = () => {
      const confirmed = confirm(
        `Are you sure you want to delete this command? (${command.name})`
      );

      if (confirmed) {
        commands = commands.filter((c) => c.name !== command.name);
        localStorage.setItem("commands", JSON.stringify(commands));
        addLog(`${command.name} deleted`);
        loadCommands();
      }
    };

    $customCommands.appendChild(commandCard);
  });
};

loadCommands();

window.openCustomCommandForm = openCustomCommandForm;
window.closeCustomCommandForm = closeCustomCommandForm;
window.createCustomCommand = createCustomCommand;
