/** @type {import("../../types/config.d.ts").ConfigurationObject} */
const config = {
	autoRestart: true,
	client: {
		token: process.env.DISCORD_TOKEN,
		intents: 'all',
	},
	logger: {
		title: 'DDevsJS',
		strategy: 'attached',
	},
}

export default config
