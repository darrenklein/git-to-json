const fs = require('fs');
const path = require('path');
const formatting = require('./formatting.js');

const { stdoutToJSON, formatDir } = formatting;
const { sep } = path;
const moduleExport = {};

function directoryExists(dirPath) {
  if (fs.existsSync(dirPath)) {
    return { status: true }
  }

  const separatedDirPath = dirPath.split(sep);
  const dirPathArray = separatedDirPath.slice(1, separatedDirPath.length - 1);

  let existingPath = `.${sep}`
  let nonExistentPathElements = []

  for (let i = 0; i < dirPathArray.length; i++) {
    if (fs.existsSync(`${existingPath}${dirPathArray[i]}`)) {
      existingPath = `${existingPath}${dirPathArray[i]}${sep}`
    } else {
      nonExistentPathElements.push(dirPathArray[i])
    }
  }

  return {
    status: false,
    existingPath: existingPath,
    nonExistentPathElements: nonExistentPathElements
  }
}

function maybeRemoveDirectory(directory) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(directory)) {
      fs.rmdir(directory, err => (err ? reject(err) : resolve(directory)));
    }

    return reject(directory);
  });
}

function maybeMakeDirectory(directory) {
  const callback = function(formattedDir) {
    return new Promise((resolve, reject) => {
      const dirExists = directoryExists(formattedDir);

      if (dirExists.status) {
        return resolve(formattedDir);
      }

      return dirExists.nonExistentPathElements.reduce((createdPath, currentDir, currentIndex, pathArray) => {
        if (currentIndex === pathArray.length - 1) {
          try {
            fs.mkdirSync(`${createdPath}${currentDir}${sep}`);
            return resolve(`${createdPath}${currentDir}${sep}`);
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
      }, `${dirExists.existingPath}`)

    })
  }

  return formatDir(directory, callback)
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
