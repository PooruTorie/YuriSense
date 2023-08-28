const express = require("express")
const {createProxyMiddleware} = require("http-proxy-middleware")

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

app.listen(3000)
