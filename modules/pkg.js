const glob = require('glob')
const path = require('path')

const pkg = {}

// pkg load order
const PREFFERED_PACKAGES_ORDER = []

pkg.load = async fp => {
	// This array hold all packages, easy for reference between packages and xHaust class itself
	fp.pkgs = []

	// Require packages and create instances
	for (let file of glob.sync('packages/*.js')) {
		const fileName = path.basename(file, '.js').toLowerCase()
		fp.pkgs[fileName] = new (require(path.resolve(file)))()
	}

	// Pass the 'this' reference, this is how all packages and main class can communicate with eachother
	for (let pkg in fp.pkgs) {
		fp.pkgs[pkg].init(fp)
	}

	// Run boot functions (which in order starts the start function in package.js), some classes need them
	for (let pkg in fp.pkgs) {
		pkg = fp.pkgs[pkg]
		// Start PREFFERED_PACKAGES_ORDER first
		for (let prefferedPkg of PREFFERED_PACKAGES_ORDER) {
			prefferedPkg = pkgs[prefferedPkg]
			if (prefferedPkg && prefferedPkg.packageStarted != true) {
				await prefferedPkg.boot()
			}
		}

		// Then the rest of the packages
		if (pkg.packageStarted != true) {
			await pkg.boot()
		}
	}
}

module.exports = pkg
