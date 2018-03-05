#! /usr/bin/env node

const childProcess = require('child_process');
const gitToJSON = require('../lib/git-to-json.js');

const dir = process.argv.indexOf('--dir') > -1 ? `${process.argv[process.argv.indexOf('--dir') + 1]}` : './';
const name = process.argv.indexOf('--name') > -1 ? `${process.argv[process.argv.indexOf('--name') + 1]}` : 'git-commit-info.js';
const upperCaseKeys = process.argv.indexOf('--upcasekeys') !== -1;

childProcess.exec('git log -1', (err, stdout) => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
    return;
  }

  gitToJSON(dir, name, upperCaseKeys, stdout);
});
