/* eslint-disable arrow-body-style, no-console */

const directory = require('./directory.js');
const writeFile = require('./file.js');

const { maybeMakeDirectory } = directory;

module.exports = function gitToJSON(dir, name, stdout) {
  return maybeMakeDirectory(dir).then((completedDirectory) => {
    return writeFile(completedDirectory, name, stdout).then(({ filePath, stdoutJSON }) => {
      console.log(`Git commit info saved to ${filePath}: ${stdoutJSON}`);
    }).catch(error => console.error(`Error writing file ${name}: ${error}`));
  }).catch(error => console.error(`Error creating directory ${dir}: ${error}`));
};
