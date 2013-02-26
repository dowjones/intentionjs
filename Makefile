REPORTER = dot

all: checkDeps clean build

build: checkDeps
	r.js -o ./lib/assets/js/app.build.js

clean:
	rm -rf build

test:
	@./node_modules/.bin/mocha \
		$(TEST_WATCH) --reporter $(REPORTER) test/suite.js

# Can't do test-watch because the require.js cache
# needs to be cleared after a file has been modified like:
# https://groups.google.com/group/requirejs/browse_thread/thread/8abddee5217779ad
#test-watch:
#	$(MAKE) test REPORTER="min" TEST_WATCH="-G --watch"

test-spec:
	$(MAKE) test REPORTER="spec"

checkDeps:
	@command -v r.js >/dev/null 2>&1 || { \
		echo "RequireJS (r.js) is needed to build this project. \
			\nYou can install it using: 'sudo npm -g install requirejs'." \
			>&2; exit 1; \
	}

.PHONY: test
