import { Loggings } from 'loggings'
import * as fs from 'node:fs'
import * as path from 'node:path'

const logger = new Loggings('Bundler', 'lavender', {
	register: false,
})
Loggings.useConsole(logger)

const PWD = process.cwd()
const SOURCE_CODE_PATH = path.resolve(PWD, 'src')
const OUTPUT_PATH = path.resolve(PWD, 'dist')
const TYPES_OUTPUT_PATH = path.resolve(OUTPUT_PATH, 'types')

const AttachTypesPlugin = {
	name: 'AttachTypesPlugin',
	target: 'node',
	setup() {
		console.log(
			`Scanning source code located at [${SOURCE_CODE_PATH}].yellow, searching to types declarations...`,
		)
		const dtsFiles = fs
			.readdirSync(SOURCE_CODE_PATH, {
				recursive: true,
			})
			.map(entry => path.resolve(SOURCE_CODE_PATH, entry))
			.filter(entry => entry.endsWith('.d.ts') && fs.statSync(entry).isFile())

		if (dtsFiles.length === 0) {
			console.warn(
				'[No types declaration has been found in your source code!].red',
			)
			return console.info('Skiping this process...')
		}

		console.info(
			`[${dtsFiles.length}].blue type declaration files found! Copying into [${TYPES_OUTPUT_PATH}].yellow`,
		)

		for (const dtsFile of dtsFiles) {
			fs.cpSync(dtsFile, TYPES_OUTPUT_PATH)
		}
		console.log('Types copied to outdir!')
	},
}

console.info('[Starting pre-bundle tasks...].cyan')

if (fs.existsSync(OUTPUT_PATH)) {
	console.warn(
		`The outdir [${OUTPUT_PATH}].yellow alreay exists, deleting it...`,
	)
	fs.rmSync(path.resolve('./dist/'), { force: true, recursive: true })
}
console.info('[Pre-bundle tasks has been finished!].cyan')

console.info('[Starting the application bundle task!].navy')
const result = await Bun.build({
	entrypoints: ['./src/index.ts'],
	outdir: OUTPUT_PATH,
	target: 'node',
	format: 'esm',
	minify: true,
	naming: '[dir]/[name]-[hash].[ext]',
	plugins: [AttachTypesPlugin],
})

if (!result.success) {
	console.error(
		'An error has been ocurred while trying to bundle the application!',
	)
	if (result.logs.length > 0) console.error(...result.logs)
	console.info(
		`[Bundle task has been finished with].navy [${result.logs.length}].red [errors!].navy`,
	)
	process.exit(1)
}

console.info('[Bundle task has been finished without any errors!].navy')
