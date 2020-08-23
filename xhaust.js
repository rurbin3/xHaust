const path = require('path')
const pkg = require('./modules/pkg')
const banner = require('./modules/banner')
const packagejson = require('./package.json')

module.exports = class xHaust {
	DEFAULT_SETTINGS = {
		attackUri: 'http://10.10.10.191/admin/login',
		user: 'fergus',
		userFile: undefined,
		pass: undefined,
		passFile: '/usr/share/seclists/Passwords/Common-Credentials/10-million-password-list-top-1000000.txt',
		test: true,
		tags: 'http-post-urlencoded',
		limitParallel: 120,
		useGui: false,
		batchSize: 1000,
		input: 'csrf=tokenCSRF',
		output: 'username=:username:&password=:password:&csrf=:csrf:'
	}

	constructor() {
		return new Promise(async (resolve, reject) => {
			this.root = require('app-root-path').path
			await pkg.load(this)
			return resolve(this)
		})
	}

	// Entry is always made via the launch function, be it via unit test, cli or w/e
	async launch(launchOptions) {
		// Default settings
		this.settings = this.DEFAULT_SETTINGS
		this.launchOptions = launchOptions

		// Debug filters
		this.Debug.filter = ['debug', 'log']
		if (true) {
			// Debug flag here?
			this.Debug.filter = ['nothing']
		}

		if (launchOptions.commander) {
			await this.runCommander()
		}

		this.Debug.debug(`Started ${packagejson.name} v${packagejson.version}`)
		this.Debug.debug(this)

		await this.prepareAttack()
	}

	// Will run commander to inquirer options from user
	async runCommander() {
		await banner.show()
		this.Debug.debug('Commander inquiry starting')
		const commanderSettings = await this.Commander.inquiry()
		this.Debug.debug('Commander settings', commanderSettings)
		this.settings = Object.assign({}, this.settings, commanderSettings)
		this.Debug.debug('Merged commander settings with default settings', this.settings)
	}

	// Everything that needs to be done before the attack loop can begin
	async prepareAttack() {
		this.Debug.info('Preparing attack')

		if (this.settings.test) {
			// this is a test, start the web server!
		}

		if (this.settings.userFile) {
			this.Debug.debug(`Using userFile "${this.settings.userFile}"`)
		}
		if (this.settings.passFile) {
			this.Debug.debug(`Using passFile "${this.settings.passFile}"`)
		}
	}
}
