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

		this.Debug.filter = ['nothing']

		this.Debug.info(`Started ${packagejson.name} v${packagejson.version}`)
		this.Debug.info({ launchOptions })
		this.Debug.debug('Show banner')
		await banner.show()

		if (launchOptions.commander) {
			this.Debug.debug('Commander inquiry launching')
			await this.Commander.inquiry()
		}
	}
}
