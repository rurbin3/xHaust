const pkg = require('./modules/pkg')
const banner = require('./modules/banner')

class xHaust {
	async start() {
		await banner.show()
		await pkg.load(this) // Load all packages, and pass reference to 'this'

		if (process.platform !== 'linux') {
			return this.debug.fatal(`Your process.platform '${process.platform}' is not linux, not supported.`)
		}

		await this.pkgs.commander.apply() // Run Commander to get all program settings
		await this.pkgs.commander.prettyPrint()
		await this.pkgs.wordlist.load()

		await this.pkgs.attack.start()
		console.log('DONE!')
	}
}

new xHaust().start()
