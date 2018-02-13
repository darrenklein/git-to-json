const directory = require("./directory.js"),
	formatting = require("./formatting.js"),
	{ maybeCreateDirectory, writeFile } = directory,
	{ formatDir } = formatting

module.exports = (dir, name, stdout) => {
	return maybeCreateDirectory(formatDir(dir))
		.then((directory) => {
			return writeFile(directory, name, stdout)
		})
		.catch((error) => {
			return console.error(error)
		})
}