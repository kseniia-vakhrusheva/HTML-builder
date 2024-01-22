const fs = require("fs").promises;
const path = require("path");

async function copyDir() {
  const fromFolderPath = path.join(__dirname, "files");
  const toFolderPath = path.join(__dirname, "files-copy");  
  try {
    await fs.mkdir(toFolderPath, { recursive: true });
    const files = await fs.readdir(fromFolderPath);
    for (const file of files) {
      const sourceFilePath = path.join(fromFolderPath, file);
      const destinationFilePath = path.join(toFolderPath, file);
      await fs.copyFile(sourceFilePath, destinationFilePath);
    }
    console.log("Directory copied");
  } catch (err) {
    console.error("Error:", err);
  }
}

copyDir();