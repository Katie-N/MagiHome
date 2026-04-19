#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#define DECODE_MAGIQUEST
#include <IRremote.hpp>
#include <private.h>



#define GPIO_3        3

void postJSON(uint32_t wandID, uint16_t command, uint8_t sensorID) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, skipping POST");
    return;
  }

  // Build JSON payload
  JsonDocument doc;
  doc["wandID"]  = wandID;
  doc["command"] = command;
  doc["sensorID"] = sensorID;
  String payload;
  serializeJson(doc, payload);

  // Send HTTP POST
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(payload);
  if (httpCode > 0) {
    Serial.printf("POST success, code: %d\n", httpCode);
    Serial.println("Response: " + http.getString());
  } else {
    Serial.printf("POST failed: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  // Wait for serial max 2 seconds, then continue anyway
  unsigned long startTime = millis();
  while (!Serial && millis() - startTime < 2000) {
    delay(10);
  }

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());

  IrReceiver.begin(GPIO_3, ENABLE_LED_FEEDBACK);
}

void loop() {
  if (IrReceiver.decode()) {
    //IrReceiver.printIRResultShort(&Serial);
    Serial.println(IrReceiver.decodedIRData.rawlen);
    if (IrReceiver.decodedIRData.rawlen == 112) { // filter non-MagiQuest packets
      uint16_t command    = IrReceiver.decodedIRData.command;
      uint32_t fullWandID = ((uint32_t)IrReceiver.decodedIRData.extra << 16)
                          | IrReceiver.decodedIRData.address;
      uint8_t sensorID = 2;

      Serial.printf("Wand ID: %08X, Command: %04X, sensorID: 0\n", fullWandID, command);
      postJSON(fullWandID, command, sensorID);
    }

    IrReceiver.resume();
  }
}
