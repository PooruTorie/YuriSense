//
// Created by paulm on 26.03.2023.
//

#ifndef CLIENT_API_H
#define CLIENT_API_H

#include "ESPAsyncWebServer.h"
#include "ArduinoJson.h"
#include "BrokerClient.h"

class API {
private:
    AsyncWebServer *server;
    BrokerClient *client;

public:
    static String uuid;

    explicit API(BrokerClient *client);

    static void generateUUID();

    void begin();

    void get(const char *path, ArRequestHandlerFunction callback);
};


#endif //CLIENT_API_H
