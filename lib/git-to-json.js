/* eslint-disable arrow-body-style, no-console */
const directory = require('./directory.js');
const writeFile = require('./file.js');

const { maybeMakeDirectory } = directory;

module.exports = function gitToJSON(dir, name, upperCaseKeys, stdout) {
  return maybeMakeDirectory(dir).then((completedDirectory) => {
    return writeFile(completedDirectory, name, upperCaseKeys, stdout).then(({ filePath, stdoutJSON }) => { // eslint-disable-line max-len
      console.log(`Git commit info saved to ${filePath}: ${stdoutJSON}`);
    }).catch(error => console.error(`Error writing file ${name}: ${error}`));
  }).catch(error => console.error(`Error creating directory ${dir}: ${error}`));
};
