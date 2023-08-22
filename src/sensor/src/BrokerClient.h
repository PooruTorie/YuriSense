//
// Created by paulm on 26.03.2023.
//

#ifndef CLIENT_BROKERCLIENT_H
#define CLIENT_BROKERCLIENT_H

#include "WiFiClient.h"
#include "MQTT.h"

class BrokerClient {
private:
    const char *ip = "";
    MQTTClient *client;
    WiFiClient net;
    int t = 0;

public:
    bool isReady = false;

    explicit BrokerClient(const WiFiClient &net);

    void setServer(const char *ip);

    bool connect();

    void handle();

    void registerDeviceMessage();

    void publishToSensorTopic(const String &varName, const String &value);
};


#endif //CLIENT_BROKERCLIENT_H
