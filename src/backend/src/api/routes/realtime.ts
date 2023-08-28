import {Router} from "express"
import YurisenseAPI from "../yurisense_api"
import {EventEmitter} from "events"

export default class RealtimeRouter {
	static events = new EventEmitter()
	static route: string = "/realtime"
	private readonly router: Router

	constructor(api: YurisenseAPI) {
		this.router = Router()

		this.router.get("/", async (req, res) => {
			res.writeHead(200, {
				"Connection": "keep-alive",
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache"
			})

			function eventSend(label: String, data) {
				res.write("event:" + label + "\n")
				if (data instanceof Object) {
					data = JSON.stringify(data)
				}
				res.write("data:" + data + "\n\n")
			}

			res.write("init\n\n")
			RealtimeRouter.events.on("send", eventSend)
			res.on("close", () => {
				RealtimeRouter.events.removeListener("send", eventSend)
				res.end()
			})
		})
	}

	get() {
		return this.router
	}
}
