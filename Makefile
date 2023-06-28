build-node:
	cd nodejs && npm run build
	cd ../

start-node: build-node
	cd nodejs && npm run start
	cd ../