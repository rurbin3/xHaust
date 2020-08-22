const path = require('path')
const crypto = require('crypto')
const fsPromises = require('fs').promises
const util = {}

util.hash = async (str, type = 'sha512', digest = 'hex') => {
	return crypto.createHash(type).update(str).digest(digest)
}

module.exports = util
