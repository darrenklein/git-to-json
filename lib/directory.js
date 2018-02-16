const fs = require('fs');
const path = require('path');
const formatting = require('./formatting.js');

const { stdoutToJSON } = formatting;
const moduleExport = {};

function maybeRemoveDirectory(directory) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(directory)) {
      fs.rmdir(directory, err => (err ? reject(err) : resolve(directory)));
    }

    return reject(directory);
  });
}

function maybeMakeDirectory(directory) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(directory)) {
      const sep = path.sep;
      const separatedDirectoryPath = directory.split(sep);
      const directoryPathArray = separatedDirectoryPath.slice(1, separatedDirectoryPath.length - 1);

      console.log(directoryPathArray)

      directoryPathArray.reduce((createdPath, currentDir, currentIndex, pathArray) => {
        if (currentIndex === pathArray.length - 1) {
          try {
            fs.mkdirSync(`${createdPath}${currentDir}${sep}`);
            return resolve(directory)
          }
          catch (error) {
            reject(error)
          }
        }

        try {
          fs.mkdirSync(`${createdPath}${currentDir}${sep}`);
          return `${createdPath}${currentDir}${sep}`;
        }
        catch (error) {
          reject(error)
        }
      }, './')
    }

    return resolve(directory);
  });
}

function writeFile(directory, name, stdout) {
  const stdoutJSON = stdoutToJSON(stdout);
  const commitOutput = `module.exports = ${stdoutJSON}`;
  const path = `${directory}${name}`;

  return fs.writeFile(path, commitOutput, (error) => {
    if (error) {
      return maybeRemoveDirectory(directory)
        .then(direc => console.error(`Error writing file ${name}, removed ${direc}`)) // eslint-disable-line no-console
        .catch(direc => console.error(`Error writing file ${name}, ${direc} not empty or does not exist, skipping rmdir`)); // eslint-disable-line no-console
    }

    return console.log(`Git commit info saved to ${path}: ${stdoutJSON}`); // eslint-disable-line no-console
  });
}

moduleExport.maybeRemoveDirectory = maybeRemoveDirectory;
moduleExport.maybeMakeDirectory = maybeMakeDirectory;
moduleExport.writeFile = writeFile;

module.exports = moduleExport;
