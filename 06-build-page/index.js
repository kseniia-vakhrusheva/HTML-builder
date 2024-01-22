const fs = require("fs").promises;
const path = require("path");

const projectDistFolderPath = path.join(__dirname, "project-dist");
const stylesFolderPath = path.join(__dirname, "styles");
const styleFilePath = path.join(projectDistFolderPath, "style.css");

const readCssFile = async (filePath) => {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (error) {
    console.error(`Error reading file: ${filePath}\n`, error);
    return "";
  }
};

//Compile styles from the styles
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
    await fs.writeFile(styleFilePath, bundleContent, "utf-8");
    console.log("Styles compiled successfully.");
  } catch (error) {
    console.error("Error processing styles.\n", error);
  }
};
joinFiles();

//Copy the assets folder
const fromFolderPath = path.join(__dirname, "assets");
const toFolderPath = path.join(__dirname, "project-dist", "assets");


async function copyDir(from, to) {
  try {
    await fs.mkdir(to, { recursive: true });
    const files = await fs.readdir(from);
    for (const file of files) {
      const sourceFilePath = path.join(from, file);
      const destinationFilePath = path.join(to, file);
      const stat = await fs.stat(sourceFilePath);
      if (stat.isDirectory()) {
        await copyDir(sourceFilePath, destinationFilePath);
      } else {
        await fs.copyFile(sourceFilePath, destinationFilePath);
        console.log(`Copied: ${file}`);
      }
    }
    console.log("Directory copied");
  } catch (err) {
    console.error("Error:", err);
  }
}
copyDir(fromFolderPath, toFolderPath);

//Replace template tags
const templatePath = path.join(__dirname, 'template.html');

async function replaceTag() {
  try {
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const templateTagRegex = /\{\{([^}]+)\}\}/g;

    async function matchComponent(match, componentName) {
      const componentPath = path.join(__dirname, 'components', `${componentName}.html`);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      return componentContent;
    }
    const replacedContent = await templateContent.replaceAsync(templateTagRegex, matchComponent);
    const outputPath = path.join(__dirname, 'project-dist', 'index.html');
    await fs.writeFile(outputPath, replacedContent);
    console.log('Tag has been replaced.');
  } catch (error) {
    console.error('Error with tag replace', error);
  }
}
String.prototype.replaceAsync = async function (regex, asyncCallback) {
  const promises = [];
  this.replace(regex, (match, ...args) => {
    const promise = asyncCallback(match, ...args);
    promises.push(promise);
    return '';
  });
  const replacementValues = await Promise.all(promises);
  return this.replace(regex, () => replacementValues.shift());
};
replaceTag();