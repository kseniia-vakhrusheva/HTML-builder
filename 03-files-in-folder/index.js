const fs = require("fs");
const path = require("path");

const secretFolderPath = path.join(__dirname, "secret-folder");

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => { 
  if (err) 
    console.log(err); 
  else { 
    console.log("\nCurrent directory filenames:"); 
    files.forEach(file => { 
      if (!file.isDirectory()) {
        const filePath = path.join(secretFolderPath, file.name);
        const fileExtname = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, path.extname(file.name));

        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`${fileName} - ${fileExtname} - ${stats.size} bytes`);
          }
        });
      }
    });
  } 
});
