# Git-to-JSON
> Read and write git commit info

Git-to-JSON is a simple NPM module designed to retrieve the info for your project's most recent git commit and write it to a file in JSON format.

## Installation

Install this package by running

``` SH
npm install --save darrenklein/git-to-json
```

or update your `package.json` dependencies like so:

``` JSON
"dependencies": {
	"git-to-json": "git+https://git@github.com/darrenklein/git-to-json.git"
}
```

and run

``` SH
npm install
```

## Usage

Git-to-JSON will read the info from your most recent git commit and write it to the file `gitignore/git-commit-info.js` in JSON format. If a `gitignore/` directory does not yet exist, Git-to-JSON will create it.

Example `gitignore/git-commit-info.js`:

``` JS
module.exports = {"commit":"5aqfaa6741871zz5e67683a012a0062bdbd46a8z","author":"Foo Bar <foo@bar.com>","date":"Sun Feb 11 13:37:29 2018 -0500","message":"My cool git commit"}
```

To run Git-to-JSON, simply include the following command in the NPM script of your choice:

``` JS
git-to-json
```

for example, in your project's `package.json` file:

``` JS
"scripts": {
	"start": "git-to-json && node index.js"
}
```