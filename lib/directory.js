const fs = require('fs');
const path = require('path');
const formatting = require('./formatting.js');

const { stdoutToJSON, formatDir } = formatting;
const { sep } = path;
const moduleExport = {};

function directoryExists(dirPath, callback) {
  if (fs.existsSync(dirPath)) {
    return callback({ status: true });
  }

  const separatedDirPath = dirPath.split(sep);
  const dirPathArray = separatedDirPath.slice(1, separatedDirPath.length - 1);
  const nonExistentPathElements = [];
  let existingPath = `.${sep}`;

  for (let i = 0; i < dirPathArray.length; i += 1) {
    if (fs.existsSync(`${existingPath}${dirPathArray[i]}`)) {
      existingPath = `${existingPath}${dirPathArray[i]}${sep}`;
    } else {
      nonExistentPathElements.push(dirPathArray[i]);
    }
  }

  return callback({
    status: false,
    existingPath,
    nonExistentPathElements,
  });
}

function maybeMakeDirectory(directory) {
  function formatCallback(formattedDir) {
    return new Promise((resolve, reject) => {
      directoryExists(formattedDir, (dirExists) => {
        if (dirExists.status) {
          return resolve(formattedDir);
        }

        function makeDirRecursive(existingPath, nonExistentPathElements) {
          if (nonExistentPathElements.length === 0) {
            return resolve(existingPath);
          }

          const newElem = nonExistentPathElements.shift();
          const newPath = `${existingPath}${newElem}${sep}`;

          return fs.mkdir(newPath, (error) => {
            if (error) {
              return reject(new Error(error));
            }

            return makeDirRecursive(newPath, nonExistentPathElements);
          });
        }

        return makeDirRecursive(dirExists.existingPath, dirExists.nonExistentPathElements);
      });
    });
  }

  return formatDir(directory, formatCallback);
}

function writeFile(directory, name, stdout) {
  const stdoutJSON = stdoutToJSON(stdout);
  const commitOutput = `module.exports = ${stdoutJSON}`;
  const filePath = `${directory}${name}`;

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, commitOutput, (error) => {
      if (error) {
        return reject(new Error(error));
      }

      return resolve({
        filePath,
        stdoutJSON,
      });
    });
  });
}

moduleExport.maybeMakeDirectory = maybeMakeDirectory;
moduleExport.writeFile = writeFile;

module.exports = moduleExport;
