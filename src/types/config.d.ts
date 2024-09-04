export declare interface AutoRestartConfigurationObject {
	client: boolean
	logger: boolean
}

export declare interface ClientConfigurationObject {
	token: string
	intents: string | string[]
}

type LoggerStrategy = 'attached' | 'standalone'

export declare interface LoggerConfigurationObject {
	title: string
	strategy: LoggerStrategy
}

export declare interface ConfigurationObject {
	readonly autoRestart: boolean | AutoRestartConfigurationObject
	readonly client: ClientConfigurationObject
	readonly logger: LoggerConfigurationObject
}
