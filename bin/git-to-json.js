#! /usr/bin/env node

const childProcess = require('child_process');
const gitToJSON = require('../lib/git-to-json.js');

const dir = process.argv.indexOf('--dir') > -1 ? `${process.argv[process.argv.indexOf('--dir') + 1]}` : './git-commit-info';
const name = process.argv.indexOf('--name') > -1 ? `${process.argv[process.argv.indexOf('--name') + 1]}.js` : 'git-commit-info.js';

childProcess.exec('git log -1', (err, stdout) => {
  if (err) {
    return console.error(err); // eslint-disable-line no-console
  }

  return gitToJSON(dir, name, stdout);
});
