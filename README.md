# Git-to-JSON
> Read latest git commit info and write it to JSON

[Git-to-JSON] is a simple NPM module designed to retrieve the info for your project's most recent git commit and write it to a file in JSON format as an exportable module.

## Installation

#### NPM

``` SH
npm install --save git-to-json
```

#### package.json

``` JSON
"dependencies": {
  "git-to-json": "git+https://git@github.com/darrenklein/git-to-json.git"
}
```

## Usage

The default behavior of Git-to-JSON is to read the info from your most recent git commit and write it to the file `git-commit-info/git-commit-info.js` as an exported module in JSON format. If a `git-commit-info/` directory does not yet exist, Git-to-JSON will create it.

Example of a `git-commit-info/git-commit-info.js` file:

``` JS
module.exports = {"commit":"5aqfaa6741871zz5e67683a012a0062bdbd46a8z","author":"Foo Bar <foo@bar.com>","date":"Sun Feb 11 13:37:29 2018 -0500","message":"My cool git commit"}
```

To run Git-to-JSON, simply include the following command in the NPM script of your choice:

``` JS
git-to-json
```

for example, in your project's `package.json` file:

``` JSON
"scripts": {
  "start": "git-to-json && node index.js"
}
```

### Options

As noted, the default behavior is to create a file named `git-commit-info.js` in a directory in your project's root named `git-commit-info/`. You can customize the names of the file and directory with the following options:

``` SH
--dir      specify the name of the directory
--name     specify the name of the file
```

For example:

``` JS
git-to-json --dir gitignore --name commit-info
```

will result in `gitignore/commit-info.js`

## Notes

This module has been formatted according to ESLint's [eslint-config-airbnb-base] rules.

[Git-to-JSON]: https://www.npmjs.com/package/git-to-json
[eslint-config-airbnb-base]: https://www.npmjs.com/package/eslint-config-airbnb-base