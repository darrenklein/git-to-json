#! /usr/bin/env node

const childProcess = require("child_process"),
	library = require("../lib.js"),
	{ maybeCreateDirectory, stdoutToJSON, writeFile } = library,
	dir = process.argv.indexOf("--dir") > -1 ? `./${process.argv[process.argv.indexOf("--dir") + 1]}/` : "./git-commit-info/",
	name = process.argv.indexOf("--name") > -1 ? `${process.argv[process.argv.indexOf("--name") + 1]}.js` : "git-commit-info.js"

childProcess.exec("git log -1", (err, stdout) => {
	if (err) {
		return console.error(err)
	}

	return maybeCreateDirectory(dir)
		.then((directory) => {
			const stdoutJSON = stdoutToJSON(stdout)

			return writeFile(`${directory}${name}`, stdoutJSON)
		})
		.catch((error) => {
			return console.error(error)
		})
})