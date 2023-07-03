build-node:
	cd nodejs && npm run build
	cd ../

start-node: build-node
	cd nodejs && npm run start
	cd ../

build-node-image:
	cd nodejs && npm run build
	docker build -t nodejs:latest -f nodejs/Dockerfile .