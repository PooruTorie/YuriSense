const {createProxyMiddleware} = require("http-proxy-middleware")

module.exports = function (app) {
	app.use(
		"/api",
		createProxyMiddleware({
			target: "http://192.168.1.10",
			changeOrigin: true,
			onProxyReq: (proxyRes, req, res) => {
				res.on("close", () => proxyRes.destroy())
			}
		})
	)
}
