const fs = require ("fs");
const path = require ("path");
const filePath = path.join(__dirname, "text.txt");
const fileReadStream = fs.createReadStream(filePath);
fileReadStream.pipe(process.stdout);
