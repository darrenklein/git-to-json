const fs = require("fs"),
	formatAttribute = require("./format-attribute.js"),
	maybeRemoveDirectory = (directory) => {
		return new Promise((resolve, reject) => {
			fs.rmdir(directory, (error) => {
				if (error) {
					return reject(directory)
				}

				return resolve(directory)
			})
		})
	}

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
					return err ? reject(err) : resolve(directory)
				})
			})
		}

		return new Promise((resolve) => {
			return resolve(directory)
		})
	},
	"writeFile": (directory, name, stdoutJSON) => {
		const commitOutput = `module.exports = ${stdoutJSON}`,
			path = `${directory}${name}`

		return fs.writeFile(path, commitOutput, (error) => {
			if (error) {
				return maybeRemoveDirectory(directory)
					.then((directory) => {
						return console.error(`Error writing file ${name}, removed ${directory}`)
					})
					.catch((directory) => {
						return console.error(`Error writing file ${name}, ${directory} not empty, skipping rmdir`)
					})
			}

			return console.log(`Git commit info saved to ${path}: ${stdoutJSON}`)
		})
	}
}