const fs = require("fs");
const path = require("path");
const readline = require("readline");

const filePath = path.join(__dirname, "text.txt");
const writeStream = fs.createWriteStream(filePath, { flags: "a" });
console.log("Hello! Enter text (type 'exit' to quit or press the ctrl + c key combination):");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", (input) => {
  if (input === "exit") {
    console.log("Bye!");
    rl.close();
  } else {
    writeStream.write(`${input}\n`);
    console.log("Enter more text:");
  }
});

rl.on("SIGINT", () => {
  console.log("\nBye!");
  writeStream.end();
  process.exit();
});
