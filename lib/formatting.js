const moduleExport = {},
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

moduleExport.formatAttribute = formatAttribute
moduleExport.stdoutToJSON = stdoutToJSON

module.exports = moduleExport