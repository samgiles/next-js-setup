.PHONY: test

testchrome:
	@./node_modules/karma/bin/karma start test/karma.conf.js --browsers Chrome --singleRun false

test:
	@./node_modules/karma/bin/karma start test/karma.conf.js
