//
// Created by paulm on 26.03.2023.
//

#include "WifiConnector.h"

void WifiConnector::connect(const char *ssid, const char *password) {
    delay(100);

    WiFiClass::mode(WIFI_STA);
    WiFi.begin(ssid, password);

    while (WiFi.waitForConnectResult() != WL_CONNECTED) {
        Serial.println("WiFi Connection Failed!");
        ESP.restart();
    }

    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

void WifiConnector::handle() {
    if (WiFiClass::status() != WL_CONNECTED) {
        ESP.restart();
    }
    if (millis() >= 3600000) {
        ESP.restart();
    }
}
