#! /usr/bin/env node

const fs = require("fs"),
	exportPrefix = "module.exports =",
	dir = "./gitignore/",
	fileName = "git-commit-info.js"

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir)
	console.log(`Created ${dir}`)
}

const stdoutToJSON = (stdout) => {
	const splitStdout = stdout.split(/\n/),
		stdoutJSON = {
			"commit": splitStdout[0],
			"author": splitStdout[1],
			"date": splitStdout[2],
			"message": splitStdout.slice(4, splitStdout.length - 1).toString().trim()
		}

	return JSON.stringify(stdoutJSON)
}

require("child_process").exec("git log", (err, stdout) => {
	if (err) {
		return console.log(err)
	}

	const stdoutJSON = stdoutToJSON(stdout),
		commitOutput = `${exportPrefix} ${stdoutJSON}`

	return fs.writeFile(`${dir}${fileName}`, commitOutput, (error) => {
		if (error) {
			return console.log(error)
		}

		return console.log(`Git commit info saved to ${dir}${fileName}: ${stdoutJSON}`)
	})
})