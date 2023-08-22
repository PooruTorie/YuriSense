//
// Created by Paul on 28.03.2023.
//

#include "Discovery.h"

void Discovery::setup() {
    if (udp.listen(CONFIG_DISCOVER_PORT)) {
        Serial.println("Listening for Discovery Broadcast");
        AsyncUDPMessage response = *new AsyncUDPMessage();
        response.print("UwU+");
        response.print(WiFi.localIP().toString());
        udp.broadcastTo(response, CONFIG_DISCOVER_PORT);
        udp.onPacket([this](AsyncUDPPacket packet) {
            String data = *new String(packet.data(), packet.length());
            Serial.println("Receive Discovery " + packet.remoteIP().toString() + " - " + data);
            if (data.equals("OwO")) {
                AsyncUDPMessage response = *new AsyncUDPMessage();
                response.print("UwU+");
                response.print(WiFi.localIP().toString());
                udp.sendTo(response, packet.remoteIP(), CONFIG_DISCOVER_PORT);
            }
        });
    }
}
