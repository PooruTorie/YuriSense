//
// Created by paulm on 26.03.2023.
//

#include "Arduino.h"
#include "WifiConnector.h"
#include "RemoteUpdater.h"
#include "API.h"
#include "BrokerClient.h"
#include "Discovery.h"

WiFiClient net;
BrokerClient client(net);
API api(&client);
Discovery discovery;

#if CONFIG_DEVICE_TYPE == 1
#include "DS18B20.h"

#define SENSOR_PIN 18

OneWire oneWire(SENSOR_PIN);
DS18B20 sensor(&oneWire);
#elif CONFIG_DEVICE_TYPE == 2
#define SENSOR_PIN 32
#endif

int pullSpeed = 5000;

void setSettings(AsyncWebServerRequest *request) {
    if (request->hasParam("pullSpeed")) {
        pullSpeed = request->getParam("pullSpeed")->value().toInt();
    }

    DynamicJsonDocument configJSON(1024);
    configJSON["pullSpeed"] = pullSpeed;

    String json;
    serializeJson(configJSON, json);
    request->send(200, "application/json", json);
}

void setBroker(AsyncWebServerRequest *request) {
    if (client.isReady) {
        request->send(409);
        return;
    }
    if (request->hasParam("ip")) {
        String brokerIp = request->getParam("ip")->value();
        Serial.println("Set new Broker on " + brokerIp);
        client.setServer(brokerIp.c_str());

        request->send(102);

        if (!client.connect()) {
            request->send(400);
            return;
        }

        client.isReady = true;
        client.registerDeviceMessage();

        request->send(200);
    } else {
        request->send(420);
    }
}

void setup() {
    Serial.begin(9600);
    Serial.println();

    WifiConnector::connect(CONFIG_SSID, CONFIG_PASSWORD);

    API::generateUUID();

    discovery.setup();

    RemoteUpdater::setup((String("YuriSense ") + CONFIG_DEVICE_TYPE_NAME).c_str());

    api.get("/broker", setBroker);
    api.get("/settings", setSettings);

    api.begin();

#if CONFIG_DEVICE_TYPE == 1
    sensor.begin();
#elif CONFIG_DEVICE_TYPE == 2
    pinMode(SENSOR_PIN, INPUT);
#endif
}

int t = 0;

void loop() {
    WifiConnector::handle();
    RemoteUpdater::handle();
    client.handle();

    if (client.isReady) {
        t++;
        if (t > pullSpeed) {
            t = 0;
#if CONFIG_DEVICE_TYPE == 1
#ifndef CONFIG_DEBUG_DATA
            sensor.requestTemperatures();

            int tt = 0;
            while (!sensor.isConversionComplete() && tt < 1000) {
                tt++;
            }

            client.publishToSensorTopic("temp", String(sensor.getTempC()));
#else
            client.publishToSensorTopic("temp", String(random(-20, 50)));
#endif
#elif CONFIG_DEVICE_TYPE == 2
#ifndef CONFIG_DEBUG_DATA
            int lightValue = analogRead(SENSOR_PIN);

            client.publishToSensorTopic("light", String(lightValue));
#else
            client.publishToSensorTopic("light", String(random(0, 4000)));
#endif
#endif
        }
    }

    delay(1);
}
