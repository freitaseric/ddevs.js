import * as fs from 'node:fs'
import * as path from 'node:path'
import schema from '../schema.json'
import { Draft07 } from 'json-schema-library'
import { InvalidConfigurationError } from '@/exceptions'
import yaml from 'yaml'

const WORK_DIRECTORY = process.cwd()
const DEFAULT_FILE_PATH = path.join(WORK_DIRECTORY, 'ddevs.yml')

export function parse() {
	const fileContent = fs.readFileSync(DEFAULT_FILE_PATH, 'utf-8')
	const draft = new Draft07(schema)

	const errors = draft.validate(draft.createNode(schema), fileContent)

	if (
		errors.length !== 0 &&
		!errors[0].message.includes('(string) in `#` to be of type `object`')
	) {
		throw new InvalidConfigurationError(
			`The configuration file located at ${DEFAULT_FILE_PATH} is not valid by the schema.`,
			{ cause: errors.map(err => err.message) },
		)
	}

	return yaml.parse(fileContent.replace('auto-restart', 'autoRestart'))
}
