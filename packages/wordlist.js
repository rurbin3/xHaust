const execSync = require('child_process').execSync
const readline = require('readline')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const util = require('../modules/util')
const { TaskTimer } = require('tasktimer')

module.exports = class Wordlist extends require('../classes/package') {
	constructor() {
		super()
	}

	async load() {
		const set = this.xhaust.settings
		this.identifier = await util.hash(`${set.wordlist}${set.attackUrl}${set.attackType}${set.payload}`)

		// Creates the wordlist storage folder
		mkdirp.sync('./datastorage')

		// checks if the wordlist exists
		if (!fs.existsSync(this.xhaust.settings.wordlist)) {
			this.debug.fatal(`${this.xhaust.settings.wordlist} does not exist`)
		}

		// count total lines with wc -l (really fast!)
		this.total = parseInt(execSync(`wc -l < ${this.xhaust.settings.wordlist}`))

		// some stats
		this.foundExisting = false
		this.todo = this.total
		this.done = 0
		this.readsPerSecond = 0
		this.writesPerSecond = 0
		new TaskTimer(1000)
			.add(task => {
				this.readsPerSecond = 0
				this.writesPerSecond = 0
			})
			.start()

		// create readline interface
		this.readline = readline.createInterface({
			input: fs.createReadStream(this.xhaust.settings.wordlist)
		})

		// create outfile for each password given out from the async generator
		if (this.xhaust.settings.useDatabase) {
			this.databaseFile = fs.createWriteStream(`./datastorage/${this.identifier}.txt`, { flags: 'a' })
		}

		// create the async generator
		this.asyncIterator = this.readline[Symbol.asyncIterator]()
	}

	async next() {
		this.done++
		this.todo--
		return await this.get()
	}

	async get() {
		const next = await this.asyncIterator.next()
		this.readsPerSecond++
		this.done++
		this.todo--
		return next
	}
}
