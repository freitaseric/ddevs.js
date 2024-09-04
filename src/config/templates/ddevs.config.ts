import type { ConfigurationObject } from '@/types'

export default {
	autoRestart: true,
	client: {
		token: process.env.DISCORD_TOKEN,
		intents: 'all',
	},
	logger: {
		title: 'DDevsJS',
		strategy: 'attached',
	},
} as ConfigurationObject
