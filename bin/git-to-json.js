#! /usr/bin/env node

const fs = require("fs"),
	dir = "./gitignore/",
	fileName = "git-commit-info.js",
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
	}

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir)
	console.log(`Created ${dir}`)
}

require("child_process").exec("git log -1", (err, stdout) => {
	if (err) {
		return console.log(err)
	}

	const stdoutJSON = stdoutToJSON(stdout),
		commitOutput = `module.exports = ${stdoutJSON}`

	return fs.writeFile(`${dir}${fileName}`, commitOutput, (error) => {
		return error ? console.log(error) : console.log(`Git commit info saved to ${dir}${fileName}: ${stdoutJSON}`)
	})
})