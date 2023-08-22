//
// Created by paulm on 26.03.2023.
//

#ifndef CLIENT_WIFICONNECTOR_H
#define CLIENT_WIFICONNECTOR_H

#include "WiFi.h"
#include "Esp.h"

class WifiConnector {
public:
    static void connect(const char *ssid, const char *password);

    static void handle();
};


#endif //CLIENT_WIFICONNECTOR_H
