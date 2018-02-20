# Git-to-JSON
> Read latest git commit info and write it to JSON

Git-to-JSON is a simple NPM module designed to retrieve the info for your project's most recent git commit and write it to a file in JSON format as an exportable module.

[git-to-json]

## v1.X.X to v2.X.X

#### Differences

In v2.X.X of Git-to-JSON, the user has more control over the script's behavior. The main differences are:

- The default behavior of v1.X.X was to create a directory adjacent to your `package.json` that would contain the exported git JSON info - that directory is no longer created by default.

- v1.X.X only allowed a user to create a directory one level deep, such as `gitignore/git-commit-info.js` - v2.X.X allows a user to create a directory of any depth, such as `gitignore/git-info/git-commit-info.js`

#### Upgrading

Version 2.X.X of Git-to-JSON includes an additional dependency, [path], so the first step to upgrade your version is to run:

``` SH
npm update git-to-json
```

The default behavior of the module has changed slightly - instead of adding a directory and file named `git-commit-info/git-commit-info.js` adjacent to your `package.json` file, Git-to_JSON will now just create the file - the directory is optional. If you were using the basic `git-to-json` command in your project, you would now need to specify the directory name with the `--dir` flag to replicate the behavior:

```
git-to-json --dir git-commit-info
```

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

The default behavior of Git-to-JSON is to read the info from your most recent git commit and write it to the file `./git-commit-info.js` adjacent to your `package.json` file.

Example of a `git-commit-info.js` file:

``` JS
module.exports = {"commit":"5aqfaa6741871zz5e67683a012a0062bdbd46a8z","author":"Foo Bar <foo@bar.com>","date":"Sun Feb 11 13:37:29 2018 -0500","message":"My cool git commit"}
```

To run Git-to-JSON, simply include the following command in the NPM script of your choice:

```
git-to-json
```

for example, in your project's `package.json` file:

``` JSON
"scripts": {
  "start": "git-to-json && node index.js"
}
```

### Options

As noted, the default behavior is to create a file named `git-commit-info.js` adjacent to your `package.json` file. You can also provide an optional directory and customize the file's name with the following options:

``` SH
--dir      specify the name of the directory
--name     specify the name of the file
```

For example:

``` JS
git-to-json --dir gitignore --name commit-info
```

will result in `gitignore/commit-info.js`

If the directory provided does not exist, Git-to-JSON will create it. If it does exist, Git-to-JSON will output the file to the existing directory.

## Notes

This module has been formatted according to ESLint's [eslint-config-airbnb-base] rules.

[git-to-json]: https://www.npmjs.com/package/git-to-json
[path]: https://www.npmjs.com/package/path
[eslint-config-airbnb-base]: https://www.npmjs.com/package/eslint-config-airbnb-base