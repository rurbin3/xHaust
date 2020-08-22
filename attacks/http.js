module.exports = class HttpAttack extends require('../classes/attack') {
	constructor() {
		super()
	}
	onGet() {
		console.log('onGET!')
	}

	onPost() {
		console.log('onPOST!')
	}
}
