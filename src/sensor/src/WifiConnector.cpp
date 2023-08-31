//
// Created by paulm on 26.03.2023.
//

#include "WifiConnector.h"

void WifiConnector::connect(const char *ssid, const char *password) {
    delay(100);

    WiFiClass::mode(WIFI_STA);
    WiFi.begin(ssid, password);

    int connectStatus;
    while ((connectStatus = WiFi.waitForConnectResult()) != WL_CONNECTED) {
        Serial.println("WiFi Connection Failed!");
        switch (connectStatus) {
            case WL_NO_SHIELD:
                Serial.println("Error: No Shield");
                break;
            case WL_IDLE_STATUS:
                Serial.println("Error: Idle");
                break;
            case WL_NO_SSID_AVAIL:
                Serial.println("Error: No SSID");
                break;
            case WL_CONNECT_FAILED:
                Serial.println("Error: Connect Failed");
                break;
            case WL_CONNECTION_LOST:
                Serial.println("Error: Connection Lost");
                break;
            case WL_DISCONNECTED:
                Serial.println("Error: Disconnect");
                break;
        }
        WifiConnector::listNetworks();
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

void WifiConnector::listNetworks() {
    WiFi.disconnect();
    Serial.println("** Scan Networks **");
    int numSsid = WiFi.scanNetworks();
    if (numSsid == WIFI_SCAN_FAILED) {
        Serial.println("Couldn't get a wifi connection");
    }

    Serial.print("Number of available networks: ");
    Serial.println(numSsid);

    for (int thisNet = 0; thisNet < numSsid; thisNet++) {
        Serial.print(thisNet);
        Serial.print(") ");
        Serial.print(WiFi.SSID(thisNet));
        Serial.print("\tSignal: ");
        Serial.print(WiFi.RSSI(thisNet));
        Serial.print(" dBm");
        Serial.print("\tEncryption: ");
        switch (WiFi.encryptionType(thisNet)) {
            case WIFI_AUTH_WEP:
                Serial.println("WEP");
                break;
            case WIFI_AUTH_WPA_PSK:
                Serial.println("WPA");
                break;
            case WIFI_AUTH_WPA2_PSK:
                Serial.println("WPA2");
                break;
            case WIFI_AUTH_OPEN:
                Serial.println("None");
                break;
            case WIFI_AUTH_MAX:
                Serial.println("Highest");
                break;
            case WIFI_AUTH_WPA_WPA2_PSK:
                Serial.println("WPA WPA2");
                break;
            case WIFI_AUTH_WPA2_ENTERPRISE:
                Serial.println("WPA2 E");
                break;
            case WIFI_AUTH_WPA3_PSK:
                Serial.println("WPA3");
                break;
            case WIFI_AUTH_WPA2_WPA3_PSK:
                Serial.println("WPA2 WPA3");
                break;
            case WIFI_AUTH_WAPI_PSK:
                Serial.println("WAPI");
                break;
        }
    }
}
