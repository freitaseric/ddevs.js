export type LogProdiver = 'loggings'
export type LogStrategy = 'attached' | 'standalone'

/**
 * Declare how you will use the logger in your application.
 *
 * @interface
 */
interface LoggerOptions {
	/**
	 * Define which log provider will be used.
	 *
	 * Accepts the values `loggings` or a function that result one of these.
	 * @property
	 */
	provider: LogProdiver | (() => LogProdiver)
	/**
	 * Define which log strategy will be used.
	 *
	 * Accepts the values `attached` for attach the custom logger to default node `Console` interface, `standalone` to use the named const `logger` instead of node `Console` interface.
	 * Also accept a function that return one of these.
	 * @property
	 */
	strategy: LogStrategy | (() => LogStrategy)
}

/**
 * Configure the DDevs.js application as you wish.
 *
 * @interface
 */
export interface ApplicationOptions {
	/**
	 *	Define the discord client token.
	 *
	 * @default process.env.DISCORD_TOKEN //allows .env files
	 * @property
	 */
	token: string | (() => string)
	/**
	 * Defines whether the discord client should be restarted in case of errors
	 *
	 * @default true
	 * @property
	 */
	autoRestart: boolean
	/**
	 * Configuration options for DDevs.js logger.
	 *
	 * @property
	 */
	logger: LoggerOptions
}
