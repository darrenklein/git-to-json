const fs = require('fs');
const formatting = require('./formatting.js');

const { stdoutToJSON, formatFileName } = formatting;

// Write the file to the target directory.
module.exports = function writeFile(directory, name, upperCaseKeys, stdout) {
  const stdoutJSON = stdoutToJSON(stdout, upperCaseKeys);
  const commitOutput = `module.exports = ${stdoutJSON}`;
  const filePath = `${directory}${formatFileName(name)}`;

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
};
