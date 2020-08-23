module.exports = new (class Exec {
	constructor() {
		this.terminal = require('child_process').spawn('bash')
	}

	async run(cmd) {
		return new Promise((resolve, reject) => {
			this.terminal.stdin.write(`${cmd}\n`)

			this.terminal.stderr.once('data', data => {
				return reject(data.toString())
			})

			this.terminal.stdout.once('data', data => {
				return resolve(data.toString())
			})

			this.terminal.stderr.once('end', data => {
				return resolve(data.toString())
			})

			this.terminal.once('close', code => {
				console.log(`child process exited with code ${code}`)
			})

			this.terminal.once('exit', code => {
				console.log(`child process exited with code ${code}`)
			})
		})
	}
})()
