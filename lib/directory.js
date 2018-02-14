const fs = require('fs');
const formatting = require('./formatting.js');

const { stdoutToJSON } = formatting;
const moduleExport = {};

function maybeRemoveDirectory(directory) {
  return new Promise((resolve, reject) => {
    fs.rmdir(directory, (error) => {
      if (error) {
        return reject(directory);
      }

      return resolve(directory);
    });
  });
}

function maybeCreateDirectory(directory) {
  if (!fs.existsSync(directory)) {
    return new Promise((resolve, reject) => {
      fs.mkdir(directory, err => (err ? reject(err) : resolve(directory)));
    });
  }

  return new Promise(resolve => resolve(directory));
}

function writeFile(directory, name, stdout) {
  const stdoutJSON = stdoutToJSON(stdout);
  const commitOutput = `module.exports = ${stdoutJSON}`;
  const path = `${directory}${name}`;

  return fs.writeFile(path, commitOutput, (error) => {
    if (error) {
      return maybeRemoveDirectory(directory)
        .then(direc => console.error(`Error writing file ${name}, removed ${direc}`)) // eslint-disable-line no-console
        .catch(direc => console.error(`Error writing file ${name}, ${direc} not empty, skipping rmdir`)); // eslint-disable-line no-console
    }

    return console.log(`Git commit info saved to ${path}: ${stdoutJSON}`); // eslint-disable-line no-console
  });
}

moduleExport.maybeRemoveDirectory = maybeRemoveDirectory;
moduleExport.maybeCreateDirectory = maybeCreateDirectory;
moduleExport.writeFile = writeFile;

module.exports = moduleExport;
