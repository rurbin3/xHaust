#!/usr/bin/env node
const main = async () => {
	const xhaust = await new (require('../xhaust.js'))()
	xhaust.launch({ commander: true })
}

main()
