const figlet = require('figlet')
const chalk = require('chalk')

const banner = {}
banner.footer = async () => {
	console.log(`
  xHaust is a tool to guess/crack valid login/password pairs.
  Licensed under Massachusetts Institute of Technology (MIT) License. 
  The newest version is always available at: https://github.com/givemeallyourcats/xhaust
  Please don't use in military or secret service organizations, or for illegal purposes. 😆`)
}
banner.show = async () => {
	return await new Promise((resolve, reject) => {
		figlet(
			'xHaust',
			{
				font: 'Cosmike',
				horizontalLayout: 'full',
				verticalLayout: 'controlled smushing',
				width: 80,
				whitespaceBreak: true
			},
			(err, data) => {
				if (err) {
					console.log('Error displaying banner: ', err.toString())
					return resolve()
				}
				console.log(`\n\n          ${chalk.keyword('grey')(data.split('\n').join('\n          '))}\n\n`)
				console.log(
					`   💪⚡Blazingly fast HTTP brute forcer made in Node.js, xHausting your logins... For science.\n\n`
				)
				return resolve()
			}
		)
	})
}
module.exports = banner
