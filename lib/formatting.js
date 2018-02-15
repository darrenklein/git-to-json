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

function formatDir(dir) {
  switch (dir === './') {
    case false:
      if (dir.substring(0, 2) !== './' && dir[dir.length - 1] !== '/') {
        return `./${dir}/`;
      } else if (dir.substring(0, 2) !== './') {
        return `./${dir}`;
      } else if (dir[dir.length - 1] !== '/') {
        return `${dir}/`;
      }

      return dir;
    default: return dir;
  }
}

moduleExport.formatAttribute = formatAttribute;
moduleExport.stdoutToJSON = stdoutToJSON;
moduleExport.formatDir = formatDir;

module.exports = moduleExport;
