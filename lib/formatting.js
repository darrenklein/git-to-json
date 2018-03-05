const path = require('path');

const { sep } = path;
const moduleExport = {};

function formatAttribute(attribute) {
  if (Array.isArray(attribute)) {
    return attribute.reduce((messageString, messageLine, currentIndex, originalMessageArray) => (
      currentIndex === originalMessageArray.length - 1 ? `${messageString}${messageLine.trim()}` : `${messageString}${messageLine.trim()}\n`
    ), '');
  }

  return attribute.indexOf(':') > -1 ? attribute.split(/:(.+)/)[1].trim() : attribute.split(' ')[1];
}

function stdoutToJSON(stdout, upperCaseKeys) {
  const splitStdout = stdout.split(/\n/);
  const stdoutJSON = {
    commit: formatAttribute(splitStdout[0]),
    author: formatAttribute(splitStdout[1]),
    date: formatAttribute(splitStdout[2]),
    message: formatAttribute(splitStdout.slice(4, splitStdout.length - 1)),
  };
  const upperCaseStdoutToJSON = Object.assign(
    {},
    ...Object.keys(stdoutJSON)
      .map(key => ({ [key.toUpperCase()]: stdoutJSON[key] })),
  );

  return JSON.stringify(upperCaseKeys ? upperCaseStdoutToJSON : stdoutJSON);
}

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

function formatFileName(name) {
  const fileType = '.js';
  return name.substring(name.length - 3) === fileType ? name : `${name}${fileType}`;
}

moduleExport.formatAttribute = formatAttribute;
moduleExport.stdoutToJSON = stdoutToJSON;
moduleExport.formatDir = formatDir;
moduleExport.formatFileName = formatFileName;

module.exports = moduleExport;
