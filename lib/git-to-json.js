const directory = require("./directory.js"),
	{ maybeCreateDirectory, writeFile } = directory

module.exports = (dir, name, stdout) => {
	return maybeCreateDirectory(dir)
		.then((directory) => {
			return writeFile(directory, name, stdout)
		})
		.catch((error) => {
			return console.error(error)
		})
}