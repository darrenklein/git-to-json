const directory = require('./directory.js');
const formatting = require('./formatting.js');

const { maybeCreateDirectory, writeFile } = directory;
const { formatDir } = formatting;

module.exports = function gitToJSON(dir, name, stdout) {
  return maybeCreateDirectory(formatDir(dir))
    .then(direc => writeFile(direc, name, stdout))
    .catch(error => console.error(error)); // eslint-disable-line no-console
};
