const cliProgress = require('cli-progress')
const fs = require('fs')
const path = require('path')

module.exports = class Attack extends require('../classes/package') {
	constructor() {
		super()
	}

	async start() {
		if (!this.xhaust.settings.useGui) {
			this.bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
			this.bar.start(this.xhaust.pkgs.wordlist.total, 0)
		}

		const attackFilesTypes = []
		for (let attackType of this.xhaust.settings.attackTypes) {
			if (fs.existsSync(`./attacks/${attackType}.js`)) {
				const attackInstance = require(`../attacks/${attackType}.js`)
				attackFilesTypes.push(new attackInstance(this.xhaust))
			}
		}

		for (let i = 0; i < this.xhaust.pkgs.wordlist.total; i++) {
			const password = await this.xhaust.pkgs.wordlist.get()
			console.log(attackFilesTypes)
			for (let attackType in attackFilesTypes) {
				await attackType.attack(password)
			}
			this.bar.update(this.xhaust.pkgs.wordlist.done)
		}

		if (!this.xhaust.settings.useGui) {
			this.bar.stop()
		}
	}
}
