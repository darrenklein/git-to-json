const directory = require('./directory.js');
const writeFile = require('./file.js');

const { maybeMakeDirectory } = directory;

module.exports = function gitToJSON(dir, name, stdout) {
  return maybeMakeDirectory(dir).then((direc) => { // eslint-disable-line arrow-body-style
    return writeFile(direc, name, stdout).then(({ filePath, stdoutJSON }) => { // eslint-disable-line arrow-body-style, max-len
      return console.log(`Git commit info saved to ${filePath}: ${stdoutJSON}`); // eslint-disable-line no-console
    }).catch(error => console.error(`Error writing file ${name}: ${error}`)); // eslint-disable-line no-console
  }).catch(error => console.error(`Error creating directory ${dir}: ${error}`)); // eslint-disable-line no-console
};
