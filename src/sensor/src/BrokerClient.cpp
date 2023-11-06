//
// Created by paulm on 26.03.2023.
//

#include "BrokerClient.h"
#include "API.h"

BrokerClient::BrokerClient(const WiFiClient &net) : net(net), client(new MQTTClient()) {
}

void BrokerClient::handle() {
    if (isReady) {
        if (!client->connected())
            Serial.println("MQTT Disconnected Try Restart");
            if (!connect()) {
                Serial.println("MQTT Restart Failed");
                ESP.restart();
            }
        }
        client->loop();
        t++;
        if (t > CONFIG_KEEP_ALIVE_DELAY) {
            t = 0;
            publishToSensorTopic("keepalive", WiFi.localIP().toString());
        }
    }
}

void BrokerClient::setServer(const char *server) {
    client->begin(server, CONFIG_MQTT_PORT, net);
}

bool BrokerClient::connect() {
    return client->connect(API::uuid.c_str());
}

void BrokerClient::registerDeviceMessage() {
    DynamicJsonDocument configJSON(1024);
    configJSON["uuid"] = API::uuid;
    configJSON["ip"] = WiFi.localIP();

    String json;
    serializeJson(configJSON, json);
    client->publish("yurisense/device", json);
}

void BrokerClient::publishToSensorTopic(const String &varName, const String &value) {
    client->publish("yurisense/sensor/" + API::uuid + "/" + varName, value);
}
