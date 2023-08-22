//
// Created by Paul on 28.03.2023.
//

#ifndef CLIENT_DISCOVERY_H
#define CLIENT_DISCOVERY_H

#include "Arduino.h"
#include "WiFi.h"
#include "AsyncUDP.h"

class Discovery {

private:
    AsyncUDP udp;
public:
    void setup();
};


#endif //CLIENT_DISCOVERY_H
