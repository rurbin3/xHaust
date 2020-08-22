const glob = require('glob')
const figlet = require('figlet')
const packagejson = require('../package.json')

const banner = {}

// banner load order
const PREFFERED_PACKAGES_ORDER = []

banner.show = async fp => {
	return await new Promise((resolve, reject) => {
		figlet(`${packagejson.name}`, { font: 'Doom' }, (err, data) => {
			if (err) {
				console.log('Error displaying banner: ', err.toString())
				return resolve()
			}
			console.log(data)
			console.log(
				'💪⚡Blazingly fast HTTP brute forcer made for Linux in Node.js, xHausting your logins... For science.\n\n'
			)
			return resolve()
		})
	})
}

module.exports = banner
