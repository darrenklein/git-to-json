const library = require("../lib.js"),
	{ maybeCreateDirectory, stdoutToJSON, writeFile } = library

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