#! /usr/bin/env node

const fs = require("fs"),
	childProcess = require("child_process"),
	dir = process.argv.indexOf("--dir") > -1 ? `./${process.argv[process.argv.indexOf("--dir") + 1]}/` : "./git-commit-info/",
	name = process.argv.indexOf("--name") > -1 ? `${process.argv[process.argv.indexOf("--name") + 1]}.js` : "git-commit-info.js",
	formatAttribute = (attribute) => {
		if (Array.isArray(attribute)) {
			return attribute.toString().trim()
		}

		return attribute.indexOf(":") > -1 ? attribute.split(/:(.+)/)[1].trim() : attribute.split(" ")[1]
	},
	stdoutToJSON = (stdout) => {
		const splitStdout = stdout.split(/\n/),
			stdoutJSON = {
				"commit": formatAttribute(splitStdout[0]),
				"author": formatAttribute(splitStdout[1]),
				"date": formatAttribute(splitStdout[2]),
				"message": formatAttribute(splitStdout.slice(4, splitStdout.length - 1))
			}

		return JSON.stringify(stdoutJSON)
	},
	maybeCreateDirectory = (directory) => {
		if (!fs.existsSync(directory)) {
			return new Promise((resolve, reject) => {
				fs.mkdir(directory, (err) => {
					err ? reject(err) : resolve(directory)
				})
			})
		}

		return new Promise((resolve) => {
			resolve(directory)
		})
	}

childProcess.exec("git log -1", (err, stdout) => {
	if (err) {
		return console.error(err)
	}

	return maybeCreateDirectory(dir)
		.then((directory) => {
			const stdoutJSON = stdoutToJSON(stdout),
				commitOutput = `module.exports = ${stdoutJSON}`

			return fs.writeFile(`${directory}${name}`, commitOutput, (error) => {
				return error ? console.error(error) : console.log(`Git commit info saved to ${directory}${name}: ${stdoutJSON}`)
			})
		})
		.catch((error) => {
			console.error(error)
		})
})