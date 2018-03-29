/* eslint-disable max-len */
const fs = require('fs-extra'); // Use fs-extra to allow the removal of nested directories
const path = require('path');
const formatting = require('../lib/formatting.js');
const directory = require('../lib/directory.js');

const { sep } = path;
const {
  formatAttribute,
  stdoutToJSON,
  formatDir,
  formatFileName,
} = formatting;
const { directoryExists } = directory;

describe('Testing formatFileName(): format a file name without ".js" file type', () => {
  it('Should add the ".js" file type suffix to a file name if missing', () => {
    const testString = 'test-file';
    const expectedOutput = 'test-file.js';
    const value = formatFileName(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing formatFileName(): format a file name with a file type other than ".js"', () => {
  it('Should add the ".js" file type suffix to a file name if any other file type was provided', () => {
    const testString = 'test-file.json';
    const expectedOutput = 'test-file.json.js';
    const value = formatFileName(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing formatFileName(): format a file name with .js file type', () => {
  it('Should return the file name unchanged', () => {
    const testString = 'test-file.js';
    const expectedOutput = 'test-file.js';
    const value = formatFileName(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing formatDir(): format a directory name without "./" prefix and "/" suffix', () => {
  it('Should add the "./" prefix and "/" suffix to a directory name if missing', () => {
    const testString = 'gitignore';
    const expectedOutput = './gitignore/';
    const value = formatDir(testString, dirString => dirString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing formatDir(): format a directory name without "./" prefix', () => {
  it('Should add the "./" prefix to a directory name if missing', () => {
    const testString = 'gitignore/';
    const expectedOutput = './gitignore/';
    const value = formatDir(testString, dirString => dirString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing formatDir(): format a directory name without "/" suffix', () => {
  it('Should add the "/" suffix to a directory name if missing', () => {
    const testString = './gitignore';
    const expectedOutput = './gitignore/';
    const value = formatDir(testString, dirString => dirString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing formatDir(): return a correctly formatted directory name without changing its structure', () => {
  it('Should return the test string unchanged', () => {
    const testString = './gitignore/';
    const expectedOutput = testString;
    const value = formatDir(testString, dirString => dirString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing formatAttribute(): format a string with colon', () => {
  it('Should remove the colon, preceding label, and trailing and leading whitespace', () => {
    const testString = 'Date:   Mon Feb 12 21:34:44 2018 -0500';
    const expectedOutput = 'Mon Feb 12 21:34:44 2018 -0500';
    const value = formatAttribute(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing formatAttribute(): format a string without colon', () => {
  it('Should remove the label and trailing and leading whitespace', () => {
    const testString = 'commit 1234';
    const expectedOutput = '1234';
    const value = formatAttribute(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing formatAttribute(): format a one-element array', () => {
  it('Should convert an array of a single string into a trimmed string', () => {
    const testArray = ['    First Jasmine test'];
    const expectedOutput = 'First Jasmine test';
    const value = formatAttribute(testArray);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing formatAttribute(): format a multi-element array', () => {
  it('Should convert an array of a string into a trimmed string with newlines separating the former array elements', () => {
    const testArray = ['    First Jasmine test', '    this will be a new line', '', '    should be two newlines before this sentence'];
    const expectedOutput = 'First Jasmine test\nthis will be a new line\n\nshould be two newlines before this sentence';
    const value = formatAttribute(testArray);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing stdoutToJSON(): format commit info as JSON - single line message', () => {
  it('Should convert standard "git log -1" output to string to a stringified JSON object when the message is a single line.', () => {
    const testString = 'commit 1234\nAuthor: Foo Bar <foo@bar.com>\nDate:   Mon Feb 12 21:34:44 2018 -0500\n\n    First Jasmine test\n';
    const expectedOutput = JSON.stringify({
      commit: '1234',
      author: 'Foo Bar <foo@bar.com>',
      date: 'Mon Feb 12 21:34:44 2018 -0500',
      message: 'First Jasmine test',
    });
    const value = stdoutToJSON(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing stdoutToJSON(): format commit info as JSON with capitalized keys - single line message', () => {
  it('Should convert standard "git log -1" output to string to a stringified JSON object with capitalized keys when the message is a single line.', () => {
    const testString = 'commit 1234\nAuthor: Foo Bar <foo@bar.com>\nDate:   Mon Feb 12 21:34:44 2018 -0500\n\n    Yet another Jasmine test\n';
    const expectedOutput = JSON.stringify({
      COMMIT: '1234',
      AUTHOR: 'Foo Bar <foo@bar.com>',
      DATE: 'Mon Feb 12 21:34:44 2018 -0500',
      MESSAGE: 'Yet another Jasmine test',
    });
    const value = stdoutToJSON(testString, true);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing stdoutToJSON(): format commit info as JSON - multi-line message', () => {
  it('Should convert standard "git log -1" output to string to a stringified JSON object when the message is multi-line.', () => {
    const testString = 'commit 1234\nAuthor: Foo Bar <foo@bar.com>\nDate:   Mon Feb 12 21:34:44 2018 -0500\n\n    First Jasmine test\n    Here\'s another line!\n\n    Skipped an extra line before this one... woo!\n';
    const expectedOutput = JSON.stringify({
      commit: '1234',
      author: 'Foo Bar <foo@bar.com>',
      date: 'Mon Feb 12 21:34:44 2018 -0500',
      message: 'First Jasmine test\nHere\'s another line!\n\nSkipped an extra line before this one... woo!',
    });
    const value = stdoutToJSON(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing stdoutToJSON(): format commit info as JSON - multi-line message with double quotes', () => {
  it('Should convert standard "git log -1" output to string to a stringified JSON object when the message is multi-line and includes double quotes.', () => {
    const testString = 'commit 1234\nAuthor: Foo Bar <foo@bar.com>\nDate:   Mon Feb 12 21:34:44 2018 -0500\n\n    First Jasmine test\n    Here\'s another line!\n\n    Skipped an extra line before this one... "woo"!\n';
    const expectedOutput = JSON.stringify({
      commit: '1234',
      author: 'Foo Bar <foo@bar.com>',
      date: 'Mon Feb 12 21:34:44 2018 -0500',
      message: 'First Jasmine test\nHere\'s another line!\n\nSkipped an extra line before this one... "woo"!',
    });
    const value = stdoutToJSON(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing directoryExists(): check if an existing single-level directory exists with simple formatting', () => {
  it('Should create a temp directory with the prefix "tmp_test-", confirm that it exists and return an object with "status: true"', () => {
    fs.mkdtemp(path.join(`.${sep}`, 'tmp_test-'), (err, folder) => {
      const value = directoryExists(formatDir(folder, dirString => dirString), dirExists => dirExists);

      expect(value.status).toBe(true);
      fs.rmdirSync(folder);
    });
  });
});

describe('Testing directoryExists(): check if an existing single-level directory exists with detailed formatting', () => {
  it('Should check to see if a temp directory with the prefix "tmp_test-" and ending with a path separator exists and return an object with "status: true"', () => {
    fs.mkdtemp(path.join(`.${sep}`, 'tmp_test-'), (err, folder) => {
      const value = directoryExists(formatDir(`${folder}${sep}`, dirString => dirString), dirExists => dirExists);

      expect(value.status).toBe(true);
      fs.rmdirSync(folder);
    });
  });
});

describe('Testing directoryExists(): check if an non-existent single-level directory exists with simple formatting', () => {
  it('Should check to see if a non-existent directory named "false-test" exists and return an object verifying the directory\'s non-existence', () => {
    const dirName = 'false-test';
    const expectedOutput = JSON.stringify({
      status: false,
      existingPath: `.${sep}`,
      nonExistentPathElements: ['false-test'],
    });
    const value = JSON.stringify(directoryExists(formatDir(dirName, dirString => dirString), dirExists => dirExists));

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing directoryExists(): check if a multi-level directory with a non-existent child exists with simple formatting', () => {
  it('Should check to see if a non-existent directory named "tmp_test-/false-test" exists and return an object verifying the directory\'s non-existence', () => {
    fs.mkdtemp(path.join(`.${sep}`, 'tmp_test-'), (err, folder) => {
      const expectedOutput = JSON.stringify({
        status: false,
        existingPath: `.${sep}${folder}${sep}`,
        nonExistentPathElements: ['false-test'],
      });
      const value = directoryExists(formatDir(`${folder}${sep}false-test`, dirString => JSON.stringify(dirString)), dirExists => JSON.stringify(dirExists));

      expect(value).toBe(expectedOutput);
      fs.rmdirSync(folder);
    });
  });
});

describe('Testing directoryExists(): check if an non-existent single-level directory exists with detailed formatting', () => {
  it('Should check to see if a directory named "./false-test/" exists and return an object confirming the directory\'s non-existence', () => {
    const dirName = './false-test/';
    const expectedOutput = JSON.stringify({
      status: false,
      existingPath: './',
      nonExistentPathElements: ['false-test'],
    });
    const value = JSON.stringify(directoryExists(formatDir(dirName, dirString => dirString), dirExists => dirExists));

    expect(value).toBe(expectedOutput);
  });
});

describe('Testing directoryExists(): check if a multi-level directory with a non-existent child exists with detailed formatting', () => {
  it('Should check to see if a non-existent directory named "tmp_test-/false-test/" exists and return an object verifying the directory\'s non-existence', () => {
    fs.mkdtemp(path.join(`.${sep}`, 'tmp_test-'), (err, folder) => {
      const expectedOutput = JSON.stringify({
        status: false,
        existingPath: `.${sep}${folder}${sep}`,
        nonExistentPathElements: ['false-test'],
      });
      const value = directoryExists(formatDir(`${folder}${sep}false-test${sep}`, dirString => JSON.stringify(dirString)), dirExists => JSON.stringify(dirExists));

      expect(value).toBe(expectedOutput);
      fs.rmdirSync(folder);
    });
  });
});

describe('Testing directoryExists(): check if an existing multi-level directory exists with simple formatting', () => {
  it('Should create a temp directory with the prefix "tmp_test-", confirm that it exists and return an object with "status: true"', () => {
    fs.mkdtemp(path.join(`.${sep}`, 'tmp_test-'), (err, parentFolder) => {
      fs.mkdtemp(path.join(`.${sep}${parentFolder}`, 'tmp_test-'), (err, childFolder) => {
        const value = directoryExists(formatDir(childFolder, dirString => dirString), dirExists => dirExists);

        expect(value.status).toBe(true);
        fs.removeSync(parentFolder);
      })
    });
  });
});

describe('Testing directoryExists(): check if an existing multi-level directory exists with detailed formatting', () => {
  it('Should create a temp directory with the prefix "tmp_test-", confirm that it exists and return an object with "status: true"', () => {
    fs.mkdtemp(path.join(`.${sep}`, 'tmp_test-'), (err, parentFolder) => {
      fs.mkdtemp(path.join(`.${sep}${parentFolder}`, 'tmp_test-'), (err, childFolder) => {
        const value = directoryExists(formatDir(`${childFolder}${sep}`, dirString => dirString), dirExists => dirExists);

        expect(value.status).toBe(true);
        fs.removeSync(parentFolder);
      })
    });
  });
});
