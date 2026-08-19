PANDOC := pandoc

POSTS := $(wildcard posts/*.tex)
OUTPUTS := $(patsubst posts/%.tex,public/posts/%.html,$(POSTS))

.PHONY: all clean

all: $(OUTPUTS)
	cp -r static public/
	cp index.html public/

serve:
	cd public && python3 -m http.server 8080

dev:
	python3 tools/devserver.py

watch:
	watchexec \
		-w posts \
		-w templates \
		-w static \
		-- make

public/posts/%.html: posts/%.tex templates/post.html tools/postprocessor.py
	mkdir -p public/posts
	pandoc $< \
		--from=latex \
		--to=html5 \
		--standalone \
		--mathml \
		--template=templates/post.html \
		-o /tmp/$*.html
	python3 tools/postprocessor.py < /tmp/$*.html > $@

clean:
	rm -rf public
