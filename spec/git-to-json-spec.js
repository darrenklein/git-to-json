const gitToJSON = require("../lib/git-to-json.js"),
	{ maybeCreateDirectory, stdoutToJSON, writeFile } = gitToJSON,
	formatAttribute = require("../lib/format-attribute.js")

describe("Format a string with colon", () => {
	it ("Should remove the colon, preceding label, and trailing and leading whitespace", () => {
		const testString = "Date:   Mon Feb 12 21:34:44 2018 -0500",
			expectedOutput = "Mon Feb 12 21:34:44 2018 -0500",
			value = formatAttribute(testString)

		expect(value).toBe(expectedOutput)
	})
})

describe("Format a string without colon", () => {
	it ("Should remove the label and trailing and leading whitespace", () => {
		const testString = "commit 1234",
			expectedOutput = "1234",
			value = formatAttribute(testString)

		expect(value).toBe(expectedOutput)
	})
})

describe("Format commit info as JSON", () => {
	it ("Should convert standard 'git log -1' output to string to a stringified JSON object.", () => {
		const testString = "commit 1234\nAuthor: Foo Bar <foo@bar.com>\nDate:   Mon Feb 12 21:34:44 2018 -0500\n\nFirst Jasmine test\n",
			expectedOutput = JSON.stringify({
				"commit": "1234",
				"author": "Foo Bar <foo@bar.com>",
				"date": "Mon Feb 12 21:34:44 2018 -0500",
				"message": "First Jasmine test"
			}),
			value = stdoutToJSON(testString)

		expect(value).toBe(expectedOutput)
	})
})