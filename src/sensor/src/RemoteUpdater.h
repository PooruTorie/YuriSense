//
// Created by paulm on 26.03.2023.
//

#ifndef CLIENT_REMOTEUPDATER_H
#define CLIENT_REMOTEUPDATER_H

#include "ArduinoOTA.h"

class RemoteUpdater {
public:
    static void setup(const char *hostname);

    static void handle();
};


#endif //CLIENT_REMOTEUPDATER_H
