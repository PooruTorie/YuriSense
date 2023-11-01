const express = require("express")
const createProxyMiddleware = require("http-proxy-middleware")
const fs = require("fs")
const https = require("https")

const app = express()

app.use(express.static("build"))

app.use(
	"/api",
	createProxyMiddleware({
		target: "http://host.docker.internal:3000",
		changeOrigin: true,
		onProxyReq: (proxyRes, req, res) => {
			res.on("close", () => proxyRes.destroy())
		}
	})
)

app.get("*", (req, res) => {
	res.sendFile("index.html", {root: "build"})
})

if (fs.existsSync("ssl/server.crt") && fs.existsSync("ssl/server.key")) {
	https
		.createServer(
			{
				key: fs.readFileSync("ssl/server.key"),
				cert: fs.readFileSync("ssl/server.crt")
			},
			app
		)
		.listen(4000, () => {
			console.log("HTTPS Started on 4000")
		})
}
app.listen(3000, () => {
	console.log("HTTP Started on 3000")
})
