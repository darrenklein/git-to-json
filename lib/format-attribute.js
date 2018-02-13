module.exports = (attribute) => {
	if (Array.isArray(attribute)) {
		return attribute.toString().trim()
	}

	return attribute.indexOf(":") > -1 ? attribute.split(/:(.+)/)[1].trim() : attribute.split(" ")[1]
}