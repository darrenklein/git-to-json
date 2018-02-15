const formatting = require('../lib/formatting.js');

const { formatAttribute, stdoutToJSON, formatDir } = formatting;

describe('Format a directory name when no directory is provided - default module behavior', () => {
  it('Should accept and return the "./" prefix', () => {
    const testString = './';
    const expectedOutput = './';
    const value = formatDir(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Format a directory name without "./" prefix and "/" suffix', () => {
  it('Should add the "./" prefix and "/" suffix to a directory name if missing', () => {
    const testString = 'gitignore';
    const expectedOutput = './gitignore/';
    const value = formatDir(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Format a directory name without "./" prefix', () => {
  it('Should add the "./" prefix to a directory name if missing', () => {
    const testString = 'gitignore/';
    const expectedOutput = './gitignore/';
    const value = formatDir(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Format a directory name without "/" suffix', () => {
  it('Should add the "/" suffix to a directory name if missing', () => {
    const testString = './gitignore';
    const expectedOutput = './gitignore/';
    const value = formatDir(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Return a correctly formatted directory name without changing its structure', () => {
  it('Should return the test string unchanged', () => {
    const testString = './gitignore/';
    const expectedOutput = testString;
    const value = formatDir(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Format a string with colon', () => {
  it('Should remove the colon, preceding label, and trailing and leading whitespace', () => {
    const testString = 'Date:   Mon Feb 12 21:34:44 2018 -0500';
    const expectedOutput = 'Mon Feb 12 21:34:44 2018 -0500';
    const value = formatAttribute(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Format a string without colon', () => {
  it('Should remove the label and trailing and leading whitespace', () => {
    const testString = 'commit 1234';
    const expectedOutput = '1234';
    const value = formatAttribute(testString);

    expect(value).toBe(expectedOutput);
  });
});

describe('Format a one-element array', () => {
  it('Should convert an array of a single string into a trimmed string', () => {
    const testArray = ['    First Jasmine test'];
    const expectedOutput = 'First Jasmine test';
    const value = formatAttribute(testArray);

    expect(value).toBe(expectedOutput);
  });
});

describe('Format a multi-element array', () => {
  it('Should convert an array of a string into a trimmed string with newlines separating the former array elements', () => {
    const testArray = ['    First Jasmine test', '    this will be a new line', '', '    should be two newlines before this sentence'];
    const expectedOutput = 'First Jasmine test\nthis will be a new line\n\nshould be two newlines before this sentence';
    const value = formatAttribute(testArray);

    expect(value).toBe(expectedOutput);
  });
});

describe('Format commit info as JSON - single line message', () => {
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

describe('Format commit info as JSON - multi-line message', () => {
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
