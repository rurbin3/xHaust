const figlet = require('figlet')
const banner = {}
// banner load order
banner.show = async () => {
	return await new Promise((resolve, reject) => {
		figlet('xHaust', { font: 'Doom' }, (err, data) => {
			if (err) {
				console.log('Error displaying banner: ', err.toString())
				return resolve()
			}
			console.log(data)
			console.log(
				'💪⚡Blazingly fast HTTP brute forcer made in Node.js, xHausting your logins... For science.\n\n'
			)
			return resolve()
		})
	})
}
module.exports = banner
