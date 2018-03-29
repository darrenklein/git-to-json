const path = require('path');

const { sep } = path;
const moduleExport = {};

// Convert the git commit info into formatted strings.
// Most of the info will be strings, but the message will be an array
// where each element of the array is understood to be the start of a new line.
function formatAttribute(attribute) {
  if (Array.isArray(attribute)) {
    return attribute.reduce((messageString, messageLine, currentIndex, originalMessageArray) => (
      currentIndex === originalMessageArray.length - 1 ? `${messageString}${messageLine.trim()}` : `${messageString}${messageLine.trim()}\n`
    ), '');
  }

  return attribute.indexOf(':') > -1 ? attribute.split(/:(.+)/)[1].trim() : attribute.split(' ')[1];
}

// Convert the git info to a JSON.
function stdoutToJSON(stdout, upperCaseKeys) {
  const splitStdout = stdout.split(/\n/);
  const stdoutJSON = {
    commit: formatAttribute(splitStdout[0]),
    author: formatAttribute(splitStdout[1]),
    date: formatAttribute(splitStdout[2]),
    message: formatAttribute(splitStdout.slice(4, splitStdout.length - 1)),
  };
  const upperCaseStdoutToJSON = Object.assign({}, ...Object.keys(stdoutJSON).map(key => ({ [key.toUpperCase()]: stdoutJSON[key] }))); // eslint-disable-line max-len

  return JSON.stringify(upperCaseKeys ? upperCaseStdoutToJSON : stdoutJSON);
}

// Add path separators, as needed.
function formatDir(dir, callback) {
  let formattedDir = dir;

  if (dir.substring(0, 2) !== `.${sep}` && dir[dir.length - 1] !== `${sep}`) {
    formattedDir = `.${sep}${dir}${sep}`;
  } else if (dir.substring(0, 2) !== `.${sep}`) {
    formattedDir = `.${sep}${dir}`;
  } else if (dir[dir.length - 1] !== `${sep}`) {
    formattedDir = `${dir}${sep}`;
  }

  return callback(formattedDir);
}

// The file type should always be '.js'.
// If a user provides a different file type or none at all, append '.js'.
function formatFileName(name) {
  const fileType = '.js';
  return name.substring(name.length - 3) === fileType ? name : `${name}${fileType}`;
}

moduleExport.formatAttribute = formatAttribute;
moduleExport.stdoutToJSON = stdoutToJSON;
moduleExport.formatDir = formatDir;
moduleExport.formatFileName = formatFileName;

module.exports = moduleExport;
