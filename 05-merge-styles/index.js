const fs = require("fs").promises;
const path = require("path");

const projectDistFolderPath = path.join(__dirname, "project-dist");
const stylesFolderPath = path.join(__dirname, "styles");
const bundleFilePath = path.join(projectDistFolderPath, "bundle.css");

const readCssFile = async (filePath) => {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    console.error(`Error reading file: ${filePath}\n`, error);
    return "";
  }
};

const joinFiles = async () => {
  try {
    const files = await fs.readdir(stylesFolderPath, { withFileTypes: true });
    const stylesArray = [];
    console.log("Styles directory filenames with CSS extname:");
    for (const file of files) {
      if (!file.isDirectory() && path.extname(file.name) === ".css") {
        const filePath = path.join(stylesFolderPath, file.name);
        const fileContent = await readCssFile(filePath);
        stylesArray.push(fileContent);
        console.log(`${file.name}`);
      }
    }
    const bundleContent = stylesArray.join("\n");
    try {
      await fs.mkdir(projectDistFolderPath);
    } catch (mkdirError) {
      if (mkdirError.code !== 'EEXIST') {
        throw mkdirError;
      }
    }
    await fs.writeFile(bundleFilePath, bundleContent, "utf-8");
    console.log("Styles compiled successfully.");
  } catch (error) {
    console.error("Error processing styles.\n", error);
  }
};
joinFiles();
