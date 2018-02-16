const directory = require('./directory.js');
const formatting = require('./formatting.js');

const { maybeMakeDirectory, writeFile } = directory;

module.exports = function gitToJSON(dir, name, stdout) {
  return maybeMakeDirectory(dir)
    .then(direc => writeFile(direc, name, stdout))
    .catch(error => console.error(error)); // eslint-disable-line no-console
};
