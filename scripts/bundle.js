import * as fs from 'node:fs'
import * as path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

const AttachTypesPlugin = {
	name: 'AttachTypesPlugin',
	target: 'node',
	setup(build) {
		console.log('Copying types to outdir...')
		fs.cpSync(
			path.resolve(process.cwd(), 'src/types/'),
			path.resolve(build.config.outdir ?? 'dist', 'types'),
			{
				recursive: true,
			},
		)
		console.log('Types copied to outdir!')
	},
}

fs.rmSync(path.resolve('./dist/'), { force: true, recursive: true })

sleep(500)

const entrypoints = fs
	.readdirSync(path.resolve('./src'), {
		recursive: true,
		encoding: 'utf-8',
	})
	.map(entry => {
		return path.resolve('src', entry)
	})
	.filter(
		entry => !entry.endsWith('.d.ts') && !fs.statSync(entry).isDirectory(),
	)

console.log('Bundling the application...')
const result = await Bun.build({
	entrypoints,
	outdir: './dist/',
	target: 'node',
	format: 'esm',
	minify: true,
	naming: '[dir]/[name]-[hash].[ext]',
	plugins: [AttachTypesPlugin],
})

if (!result.success) {
	throw new Error('Build failed', {
		cause: result.logs,
	})
}

console.log('Bundle successfully!')
