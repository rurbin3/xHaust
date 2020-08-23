const { program } = require('commander')
const packagejson = require('../package.json')
const url = require('url')
const colorize = require('json-colorizer')
const chalk = require('chalk')

module.exports = class Commander extends require('../classes/package') {
	constructor() {
		super()
	}

	printFooter() {
		console.log(`
  xHaust is a tool to guess/crack valid login/password pairs.
  Licensed under Massachusetts Institute of Technology (MIT) License. 
  The newest version is always available at: https://github.com/givemeallyourcats/xhaust
  Please don't use in military or secret service organizations, or for illegal purposes. 😆`)
	}

	async inquiry() {
		program.version(packagejson.version)
		program.exitOverride()
		const example =
			'-a https://website.com -t -a http://somewebsite.com http-post-urlencoded -u admin -P passwords.txt -s 1000 -l 130 -i "csrf=token" -o "username=:username:&password=:password:&csrftoken=:csrf:"'

		program.on('--help', () => {
			console.log('')
			console.log('Example call:')
			console.log(chalk.bold.white(`  $ xhaust ${example}`))
		})

		program.option('-a, --attackUri <attackUri>', 'Protocol URI to attack')
		program.option('-u, --user <user>', 'Username to use in attack payload')
		program.option('-U, --userfile <userfile>', 'File full of usernames to use in attack payload')
		program.option('-p, --pass <pass>', 'Password to use in attack payload')
		program.option('-P, --passfile <passfile>', 'File full of passwords to use in attack payload')
		program.option('-l, --limitParallel <limitParallel>', 'Max parallel requests at a time')
		program.option('-b, --batchSize <batchSize>', 'The get and post requests batch size')
		program.option('-T, --test', 'Run attack on in built local http server for testing')
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
				this.printFooter()
				process.exit()
			}
		}

		if (process.argv.length <= 2) {
			this.xHaust.Debug.error('Need command parameters to execute xHaust...')
			program.outputHelp()
			this.printFooter()
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

		if (output.attackUri && !output.tags) {
			this.xHaust.Debug.error(`--tags are needed for all attack types, except --test runs`)
			process.exit()
		}

		if (!output.attackUri && !output.test) {
			this.xHaust.Debug.error(`either --attackUri or --test needs to be set`)
			process.exit()
		}

		return output
	}
}
