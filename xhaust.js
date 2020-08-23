const path = require('path')
const pkg = require('./modules/pkg')
const banner = require('./modules/banner')
const packagejson = require('./package.json')

module.exports = class xHaust {
	constructor() {
		return new Promise(async (resolve, reject) => {
			await pkg.load(this)
			return resolve(this)
		})
	}

	// entry.js or otherwise, comes through here to 'launcher' func
	async launch(launchOptions) {
		this.launchOptions = launchOptions
		this.rootDir = path.resolve(__dirname)

		this.Debug.filter = ['debug', 'log']
		if (true) {
			// development flag here?
			this.Debug.filter = ['nothing']
		}

		this.Debug.debug(`Started ${packagejson.name} v${packagejson.version}`)
		this.Debug.debug({ launchOptions, rootDir: this.rootDir })

		if (launchOptions.commander) {
			await banner.show()
			this.Debug.debug('Commander inquiry launching')
			await this.Commander.inquiry()
		}
	}
}
