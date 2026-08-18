from livereload import Server, shell

server = Server()

build = shell("make")

server.watch("posts/", build)
server.watch("templates/", build)
server.watch("static/", build)

server.serve(
    root="public",
    port=8080,
)
