install: 
	npm install

build:
	rm -rf dist
	npm run build

build-watch:
	npm run start

lint:
	npx eslint .
