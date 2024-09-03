import type { ApplicationOptions, LogProdiver, LogStrategy } from '@/types'
import { Loggings } from 'loggings'
import { InvalidTokenError } from '@/exceptions'
import * as dotenv from 'dotenv'
dotenv.config()

export class Application {
	private _token: string
	private _logProvider: LogProdiver
	private _logStrategy: LogStrategy
	private _autoRestart: boolean

	protected constructor(options: ApplicationOptions) {
		this._token =
			typeof options.token === 'string' ? options.token : options.token()
		this._logProvider =
			typeof options.logger.provider === 'string'
				? options.logger.provider
				: options.logger.provider()
		this._logStrategy =
			typeof options.logger.strategy === 'string'
				? options.logger.strategy
				: options.logger.strategy()
		this._autoRestart = options.autoRestart
	}

	protected static createLogger(app: Application) {
		if (app._logProvider === 'loggings') {
			const logger = new Loggings('DDevs.js', 'blue', {
				format:
					'[{status}] {title} [at].gray [{hours}:{minutes}:{seconds}].lavender [-].gray {message}',
			})

			if (app._logStrategy === 'attached') {
				Loggings.useConsole(logger)
			} else {
				return logger
			}
		} else {
			throw new Error(`The log provider ${app._logProvider} is not valid!`)
		}
	}

	protected static createApp(
		options?: Partial<ApplicationOptions>,
	): Application {
		const defaultOptions: ApplicationOptions = {
			token: () => {
				const token = process.env.DISCORD_TOKEN
				if (token && token.trim().length !== 0) return token

				throw new InvalidTokenError(
					`The provided token "${token}" is not valid!`,
				)
			},
			logger: {
				provider: 'loggings',
				strategy: 'attached',
			},
			autoRestart: true,
		}

		return new Application({
			autoRestart: options?.autoRestart ?? defaultOptions.autoRestart,
			logger: options?.logger ?? defaultOptions.logger,
			token: options?.token ?? defaultOptions.token,
		})
	}

	public static bootstrap(options?: Partial<ApplicationOptions>) {
		const app = Application.createApp(options)
		const logger = Application.createLogger(app)

		if (app._logStrategy === 'standalone' && logger) return { app, logger }
		return { app }
	}
}
