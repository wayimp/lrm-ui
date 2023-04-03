const fs = require('fs')
const dirName = __dirname + '/NVI/'

// get all the files in the current directory
const files = fs.readdirSync(dirName);

// filter out non-text files
const textFiles = files.filter((file) => {
  const ext = file.split('.').pop();
  return ['json'].includes(ext);
});

// create a new string to contain the contents of all the text files
let mergedText = '';

// loop through the text files, read the contents and add them to the mergedText variable
textFiles.forEach((file) => {
  const text = fs.readFileSync(dirName + file);
  mergedText += text;
});

// write the mergedText variable to a new file
fs.writeFileSync(__dirname + '/NVIComplete.json', mergedText);