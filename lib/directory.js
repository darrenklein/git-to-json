const fs = require('fs');
const path = require('path');
const formatting = require('./formatting.js');

const { formatDir } = formatting;
const { sep } = path;
const moduleExport = {};

function directoryExists(dirPath, callback) {
  if (fs.existsSync(dirPath)) {
    return callback({ status: true });
  }

  const splitDirPath = dirPath.split(sep);
  const dirPathArray = splitDirPath.slice(1, splitDirPath.length - 1);
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

function maybeMakeDirectory(dir) {
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

  return formatDir(dir, formatCallback);
}

moduleExport.directoryExists = directoryExists;
moduleExport.maybeMakeDirectory = maybeMakeDirectory;

module.exports = moduleExport;
