import * as mqtt from "mqtt";
import {EventEmitter} from "events";
import axios from "axios";
import {Logger} from "../utils/logger";
import {clearInterval} from "timers";

export default class MqttClient extends EventEmitter {
    private connection: mqtt.MqttClient;
    private sensors: Sensor[] = [];

    constructor(host: string) {
        super();
        this.setMaxListeners(50);
        this.connection = mqtt.connect(host, {
            port: 1883,
            clientId: "tempi-backend"
        });
        this.connection.on("error", (error) => {
            Logger.fatal("Can't connect" + error);
        });
        this.connection.on("connect", () => {
            this.connection.subscribe("tempi/device");
            this.connection.on("message", (topic, message) => {
                if (topic === "tempi/device") {
                    this.registerNewSensor(JSON.parse(message.toString()));
                    return;
                }
                this.emit("message", topic, message);
            });
        });
    }

    public getSensors(): Sensor[] {
        return this.sensors;
    }

    subscribe(topic: string) {
        this.connection.subscribe(topic);
    }

    unsubscribe(topic: string) {
        this.connection.unsubscribe(topic);
    }

    private registerNewSensor(data: { uuid: string, ip: string }) {
        if (!this.sensors.find(sensor => sensor.uuid == data.uuid)) {
            const sensor = new Sensor(this, data.uuid, data.ip, () => {
                this.emit("newSensor", sensor);
            });
            this.sensors.push(sensor);
            sensor.on("disconnect", () => {
                this.sensors = this.sensors.filter(s => s.uuid !== sensor.uuid);
                this.emit("removeSensor", sensor);
            });
        }
    }
}

export class Sensor extends EventEmitter {
    settings = {};
    private connection: MqttClient;
    private readonly _topic: string;
    private readonly _uuid: string;
    private _version: string = "x.x.x";
    private _alive: number = 10;
    private readonly _aliveInterval: NodeJS.Timer;

    constructor(connection: MqttClient, uuid: string, ip: string, initCallback: Function) {
        super();
        this.setMaxListeners(50);
        this.connection = connection;
        this._topic = "tempi/sensor/" + uuid;
        this._uuid = uuid;
        this._ip = ip;

        connection.subscribe(this._topic + "/#");
        connection.on("message", (topic, message) => {
            if (topic.startsWith(this._topic)) {
                const messageLabel = topic.replace(this._topic + "/", "");
                if (messageLabel === "keepalive") {
                    this.alive(message.toString());
                } else {
                    this.emit("message", topic, messageLabel, message);
                }
            }
        });
        this.requestConfiguration().then(() => initCallback());
        this.requestSettings();

        this._aliveInterval = setInterval(() => {
            if (this._alive < 0) {
                this.kill();
            }
            this._alive--;
        }, 1000);
    }

    private _ip: string;

    get ip(): string {
        return this._ip;
    }

    private _type: string = "not_detected";

    get type(): string {
        return this._type;
    }

    get uuid(): string {
        return this._uuid;
    }

    get topic(): string {
        return this._topic;
    }

    get firmwareVersion(): string {
        return this._version;
    }

    toString() {
        return "Sensor {" +
            "ip: " + this._ip +
            ", uuid: " + this._uuid +
            ", topic: " + this._topic +
            "}";
    }

    alive(ip: string) {
        this._ip = ip;
        this._alive = 20;
        this.emit("alive");
    }

    toObject(name: string) {
        return {
            uuid: this.uuid,
            type: this.type,
            version: this.firmwareVersion,
            ip: this.ip,
            name
        }
    }

    public kill() {
        clearInterval(this._aliveInterval);
        this.connection.unsubscribe(this._topic + "/#");
        this.emit("disconnect");
    }

    private async requestConfiguration() {
        const res = await axios.get("http://" + this._ip + "/");
        this._version = res.data.version;
        this._type = res.data.type;
        Logger.debug("Request Configuration", this.toString());
    }

    private async requestSettings() {
        const res = await axios.get("http://" + this._ip + "/settings");
        this.settings = res.data;
        Logger.debug("Request Settings", this.settings);
    }
}