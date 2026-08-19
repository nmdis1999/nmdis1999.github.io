from livereload import Server, shell
import os

# Livereload server that runs `make` when source files change.
# Watch only source folders (do NOT watch `public/` or the venv) to avoid rebuild loops.
server = Server()

build = shell("make")

# Watch common source locations and file types. Add or remove patterns as needed.
watch_patterns = [
    "posts/",
    "templates/",
    "static/",
    "tools/",
    "index.html",
    "Makefile",
    "*.md",
    "posts/**/*.tex",
    "templates/**/*.html",
    "static/**/*.css",
    "static/**/*.js",
    "static/images/**/*",
]

for p in watch_patterns:
    server.watch(p, build)

port = int(os.environ.get("PORT", 8080))

server.serve(
    root="public",
    port=port,
)
