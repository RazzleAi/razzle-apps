build-node:
	cd nodejs && npm run build
	cd ../

start-node: build-node
	cd nodejs && npm run start
	cd ../

build-image:
	@echo "Building docker image"
	cd nodejs && docker build -t razzleai/razzle-apps-node:$(IMAGE_TAG) .
	cd ../
