
mocha = ./node_modules/.bin/mocha
istanbul = ./node_modules/.bin/istanbul
browserify = ./node_modules/.bin/browserify

ifndef MOCHA_PATH
    MOCHA_PATH = test
endif

.PHONY: test coverage test-functional

test: $(mocha)
	NODE_PATH=src $(mocha) --recursive $(MOCHA_PATH)

test-functional: $(browserify)
	NODE_PATH=src $(browserify) test-functional/index.js > test-functional/out.js

coverage:
	NODE_PATH=src $(istanbul) cover $(mocha) --recursive $(MOCHA_PATH)

$(mocha) $(istanbul) $(browserify):
	npm install
