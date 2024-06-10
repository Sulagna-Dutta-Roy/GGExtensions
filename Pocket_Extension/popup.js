const config = require("./config");

function initializeApp() {
  console.log("Initializing app...");
  console.log("Environment:", config.app.environment);
  console.log("Port:", config.app.port);
  // You can add more initialization logic here
}

initializeApp();
