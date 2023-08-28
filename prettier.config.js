/** @type {import("prettier").Config} */
module.exports = {
	trailingComma: "none",
	useTabs: true,
	tabWidth: 3,
	semi: false,
	singleQuote: false,
	quoteProps: "consistent",
	bracketSpacing: false,
	bracketSameLine: false,
	printWidth: 120,
	overrides: [
		{
			files: ["*.js", "*.jsx"],
			options: {
				parser: "babel-flow"
			}
		}
	]
}
