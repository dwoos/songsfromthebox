.PHONY: build

build:
	mkdir -p build
	cp -r site/* build/
	./songs.sh > build/songs.js
