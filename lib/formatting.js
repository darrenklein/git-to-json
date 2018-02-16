const moduleExport = {};

function formatAttribute(attribute) {
  if (Array.isArray(attribute)) {
    return attribute.reduce((messageString, messageLine, currentIndex, originalMessageArray) => (
      currentIndex === originalMessageArray.length - 1 ? `${messageString}${messageLine.trim()}` : `${messageString}${messageLine.trim()}\n`
    ), '');
  }

  return attribute.indexOf(':') > -1 ? attribute.split(/:(.+)/)[1].trim() : attribute.split(' ')[1];
}

function stdoutToJSON(stdout) {
  const splitStdout = stdout.split(/\n/);
  const stdoutJSON = {
    commit: formatAttribute(splitStdout[0]),
    author: formatAttribute(splitStdout[1]),
    date: formatAttribute(splitStdout[2]),
    message: formatAttribute(splitStdout.slice(4, splitStdout.length - 1)),
  };

  return JSON.stringify(stdoutJSON);
}

moduleExport.formatAttribute = formatAttribute;
moduleExport.stdoutToJSON = stdoutToJSON;

module.exports = moduleExport;
