const { program } = require('commander')
const packagejson = require('../package.json')
const url = require('url')
const colorize = require('json-colorizer')
const chalk = require('chalk')
const banner = require('../modules/banner')

module.exports = class Commander extends require('../classes/package') {
	constructor() {
		super()
	}

	async inquiry() {
		program.name('xhaust').usage('[options]')
		program.version(packagejson.version)
		program.exitOverride()
		const example =
			'-a https://website.com -t -a http://somewebsite.com http-post-urlencoded -u admin -P passwords.txt -s 1000 -l 130 -i "csrf=token" -o "username=:username:&password=:password:&csrftoken=:csrf:"'

		program.on('--help', () => {
			console.log('')
			console.log('Example call:')
			console.log(chalk.bold.white(`  $ xhaust ${example}`))
			process.exit()
		})

		program.option('-a, --attackUri <attackUri>', 'protocol URI to attack')
		program.option('-u, --user <user>', 'username to use in attack payload')
		program.option('-U, --userfile <userfile>', 'file full of usernames to use in attack payload')
		program.option('-p, --pass <pass>', 'password to use in attack payload')
		program.option('-P, --passfile <passfile>', 'file full of passwords to use in attack payload')
		program.option('-l, --limitParallel <limitParallel>', 'max parallel requests at a time')
		program.option('-b, --batchSize <batchSize>', 'the get and post requests batch size')
		program.option('-d, --dry-run <dryRun>', 'executes the attack in dry run mode')
		program.option('-T, --test', 'run attack on in built local http server for testing')
		program.option(
			'-t, --tags <tags>',
			'tags to use for this attack seperated by hypens (Ex. http-post-urlencoded)'
		)
		program.option(
			'-i, --input <input>',
			'input string to use as first scan structure data (Ex. form input names configurations)'
		)
		program.option(
			'-o, --output <output>',
			'output string to use as payload for attack, will replace :username: :password: and :csrf: with respectable values'
		)
		program.option('-g, --useGui', 'enable gui')

		try {
			program.parse(process.argv)
		} catch (err) {
			if (err.code === 'commander.unknownOption' || err.code == 'commander.missingMandatoryOptionValue') {
				console.log('\n')
				this.xHaust.Debug.error(err.toString().replace('CommanderError: error: ', ''))
				program.outputHelp()
				banner.footer()
				process.exit()
			}
		}

		if (process.argv.length <= 2) {
			this.xHaust.Debug.error('Need command parameters to execute xHaust...')
			program.outputHelp()
			banner.footer()
			process.exit()
		}

		const output = {}

		if (program.attackUri) output.attackUri = program.attackUri
		if (program.user) output.user = program.user
		if (program.userFile) output.userFile = program.userFile
		if (program.pass) output.pass = program.pass
		if (program.passFile) output.passFile = program.passFile
		if (program.test) output.test = program.test
		if (program.tags) output.tags = program.tags
		if (program.limitParallel) output.limitParallel = program.limitParallel
		if (program.useGui) output.useGui = program.useGui
		if (program.batchSize) output.batchSize = program.batchSize
		if (program.input) output.input = program.input
		if (program.output) output.output = program.output

		if (!output.attackUri && !output.test) {
			this.xHaust.Debug.error(`either --attackUri or --test needs to be set`)
			process.exit()
		}

		if (output.attackUri && output.test) {
			this.xHaust.Debug.error(`--attackUri and --test cannot be set both`)
			process.exit()
		}

		if (output.attackUri && !output.tags) {
			this.xHaust.Debug.error(`--tags are needed for all attack types, except --test runs`)
			process.exit()
		}

		return output
	}
}
