const fs = require("fs"),
	formatAttribute = require("./format-attribute.js")

module.exports = {
	"stdoutToJSON": (stdout) => {
		const splitStdout = stdout.split(/\n/),
			stdoutJSON = {
				"commit": formatAttribute(splitStdout[0]),
				"author": formatAttribute(splitStdout[1]),
				"date": formatAttribute(splitStdout[2]),
				"message": formatAttribute(splitStdout.slice(4, splitStdout.length - 1))
			}

		return JSON.stringify(stdoutJSON)
	},
	"maybeCreateDirectory": (directory) => {
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
	},
	"writeFile": (path, stdoutJSON) => {
		const commitOutput = `module.exports = ${stdoutJSON}`

		return fs.writeFile(path, commitOutput, (error) => {
			return error ? console.error(error) : console.log(`Git commit info saved to ${path}: ${stdoutJSON}`)
		})
	}
}