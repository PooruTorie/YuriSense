//
// Created by paulm on 26.03.2023.
//

#include "API.h"

#include <utility>
#include "BrokerClient.h"

String API::uuid = "";

API::API(BrokerClient *client) : client(client), server(new AsyncWebServer(80)) {
    server->on("/", HTTP_GET, [this](AsyncWebServerRequest *request) {
        DynamicJsonDocument configJSON(1024);
        configJSON["uuid"] = API::uuid;
        configJSON["version"] = CONFIG_VERSION;
        configJSON["type"] = CONFIG_DEVICE_TYPE_NAME;
        configJSON["connected"] = API::client->isReady;

        String json;
        serializeJson(configJSON, json);
        request->send(200, "application/json", json);
    });
}

void API::begin() {
    server->begin();
}

void API::get(const char *path, ArRequestHandlerFunction callback) {
    server->on(path, HTTP_GET, std::move(callback));
}

void API::generateUUID() {
    uuid = WiFi.macAddress();

    Serial.print("UUID is: ");
    Serial.println(uuid);
}
