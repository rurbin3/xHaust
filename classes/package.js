const chalk = require('chalk')
const ora = require('ora')

module.exports = class Package {
	constructor() {
		this.pretty = require('prettycli')
		this.spinner = { interval: {} }
		this.spinner.ora = ora('Initializing').start().stop()
		this.spinner.colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray']

		this.spinner.stop = async text => {
			this.spinner.ora.stop()
		}

		this.spinner.start = async text => {
			this.spinner.ora.stop()
			this.spinner.ora = ora(text).start()
			clearInterval(this.spinner.interval.color)
			this.spinner.interval.color = setInterval(() => {
				this.spinner.ora.color = this.getRandomColor()
			}, 1000)
		}

		this.sign = {
			loading: (title, msg = '') => {
				this.pretty.loading(title, msg)
				this.spinner.start('Loading...')
			},
			info: (title, msg = '') => {
				this.spinner.ora.stop()
				this.pretty.loading(title, msg)
			},
			success: (title, msg = '') => {
				this.spinner.ora.stop()
				this.pretty.info(title, msg)
			},
			warn: msg => {
				this.spinner.ora.stop()
				this.pretty.warn(msg)
			},
			error: msg => {
				this.spinner.ora.stop()
				this.pretty.error(msg)
			}
		}
		this.debug = {
			debugger: {},
			info: this.debugInfoFunc.bind(this),
			debug: this.debugDebugFunc.bind(this),
			warn: this.debugWarnFunc.bind(this),
			error: this.debugErrorFunc.bind(this),
			log: this.debugLogFunc.bind(this),
			fatal: this.debugFatalFunc.bind(this)
		}
	}

	getRandomColor = () => {
		return this.spinner.colors[Math.floor(Math.random() * this.spinner.colors.length)]
	}

	debugMainFunc(msg, type) {
		const name = this.constructor.name.toLowerCase()
		if (type === 'error') {
			console.error(msg.toString())
			throw msg
		}
		this.debug.debugger[type] = require('debug')(`xhaust:${type}:${name}.js`)
		this.debug.debugger[type](msg)
	}

	debugWarnFunc(msg) {
		this.debugMainFunc(msg, chalk.keyword('orange')('warn'))
	}

	debugFatalFunc(error) {
		this.sign.error(error.toString())
		throw error
	}

	debugErrorFunc(msg) {
		this.debugMainFunc(msg, chalk.red('error'))
	}

	debugInfoFunc(msg) {
		this.debugMainFunc(msg, chalk.blue('info'))
	}

	debugLogFunc(msg) {
		this.debugMainFunc(msg, chalk.white('log'))
	}

	debugDebugFunc(msg) {
		this.debugMainFunc(msg, chalk.grey('debug'))
	}

	async init(xhaust) {
		this.xhaust = xhaust
		this.xhaust.debug = this.debug
	}

	async boot() {
		this.debug.info(`pkg '${this.constructor.name}' booted`)
		this.packageStarted = true
	}
}
