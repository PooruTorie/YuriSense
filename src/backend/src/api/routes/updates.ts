import {Router} from "express";
import TempiAPI from "../tempi_api";
import * as fs from "fs";
import SensorUpdater from "../../updater/sensor_updater";

export default class UpdatesRouter {
    static route: string = "/updates";
    private readonly router: Router;

    constructor(api: TempiAPI) {
        this.router = Router();

        this.router.get("/newest/:type", async (req, res) => {
            const config = JSON.parse(fs.readFileSync("updates/config.json", {encoding: "utf8"}));

            if (config.types[req.params.type]) {
                res.json({version: config.types[req.params.type].version});
            } else {
                res.sendStatus(404);
            }
        });

        this.router.get("/update/:uuid", async (req, res) => {
            const sensor = api.mqtt.getSensors().find(sensor => sensor.uuid == req.params.uuid);

            if (sensor) {
                const update = SensorUpdater.update(sensor);
                update.catch(e => res.json({error: e}));
                update.then(() => res.json({success: true}));
            } else {
                res.sendStatus(404);
            }
        });
    }

    get() {
        return this.router;
    }
}