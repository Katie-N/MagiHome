#include <Arduino.h>
void setup() {
  // Initialize UART at 9600 baud rate
  Serial.begin(9600); 
  
  // Optional: Wait for the serial port to connect
  while (!Serial) { ; } 
  
  Serial.println("UART Initialized. Send some text!");
}

void loop() {
  // Check if data is available in the buffer
   {
  
    Serial.print("I am sending ");
    
  }
}