const fs = require('fs');
const formatting = require('./formatting.js');

const { stdoutToJSON, formatFileName } = formatting;

module.exports = function writeFile(directory, name, stdout) {
  const stdoutJSON = stdoutToJSON(stdout);
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
