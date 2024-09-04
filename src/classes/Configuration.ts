import { jsonParser, tomlParser, yamlParser } from '@/config'
import type {
	AutoRestartConfigurationObject,
	ClientConfigurationObject,
	ConfigurationObject,
	LoggerConfigurationObject,
} from '@/types'
import * as fs from 'node:fs'
import * as path from 'node:path'

export class Configuration implements ConfigurationObject {
	private static readonly DEFAULT_JAVASCRIPT_BASE_PATH = path.resolve(
		process.cwd(),
		'ddevs.config',
	)

	readonly autoRestart: boolean | AutoRestartConfigurationObject
	readonly client: ClientConfigurationObject
	readonly logger: LoggerConfigurationObject

	private constructor(
		autoRestart: boolean | AutoRestartConfigurationObject,
		client: ClientConfigurationObject,
		logger: LoggerConfigurationObject,
	) {
		this.autoRestart = autoRestart
		this.client = client
		this.logger = logger
	}

	public static fromJson(): Configuration {
		const configJsonObject = jsonParser.parse()

		return new Configuration(
			configJsonObject.autoRestart,
			configJsonObject.client,
			configJsonObject.logger,
		)
	}

	public static fromYaml(): Configuration {
		const configYamlObject = yamlParser.parse()

		return new Configuration(
			configYamlObject.autoRestart,
			configYamlObject.client,
			configYamlObject.logger,
		)
	}

	public static fromToml(): Configuration {
		const configYamlObject = tomlParser.parse()

		return new Configuration(
			configYamlObject.autoRestart,
			configYamlObject.client,
			configYamlObject.logger,
		)
	}

	public static async fromJavascript(
		ext: '.js' | 'mjs' | 'ts',
	): Promise<Configuration> {
		const configJavascriptObject: ConfigurationObject = (
			await import(
				`${path.resolve(Configuration.DEFAULT_JAVASCRIPT_BASE_PATH)}.${ext}`
			)
		).default

		return new Configuration(
			configJavascriptObject.autoRestart,
			configJavascriptObject.client,
			configJavascriptObject.logger,
		)
	}
}
