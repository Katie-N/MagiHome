#include <Arduino.h>
void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  Serial.println("Hello from Metro ESP32-S3!");
}

void loop() {
  Serial.println("Still alive...");
  delay(1000);
}