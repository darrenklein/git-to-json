const fs = require("fs"),
	formatting = require("./formatting.js"),
	{ formatAttribute, stdoutToJSON } = formatting,
	moduleExport = {},
	maybeRemoveDirectory = (directory) => {
		return new Promise((resolve, reject) => {
			fs.rmdir(directory, (error) => {
				if (error) {
					return reject(directory)
				}

				return resolve(directory)
			})
		})
	},
	maybeCreateDirectory = (directory) => {
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
	writeFile = (directory, name, stdout) => {
		const stdoutJSON = stdoutToJSON(stdout),
			commitOutput = `module.exports = ${stdoutJSON}`,
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

moduleExport.maybeRemoveDirectory = maybeRemoveDirectory
moduleExport.maybeCreateDirectory = maybeCreateDirectory
moduleExport.writeFile = writeFile

module.exports = moduleExport