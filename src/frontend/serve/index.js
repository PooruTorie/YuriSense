const express = require("express")
const proxy = require("http-proxy-middleware")

const app = express()

app.use(express.static("build"))

app.use(
	"/api",
	proxy({target: "http://host.docker.internal:3000", changeOrigin: true})
)

app.listen(3000)
