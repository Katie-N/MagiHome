#include <Arduino.h>
#define DECODE_MAGIQUEST
#include <IRremote.hpp> 
void onIRReceived(uint8_t pin);
// Define your IR receiver pins
const uint8_t IR_PINS[] = {2, 3,};
const uint8_t NUM_RECEIVERS = sizeof(IR_PINS) / sizeof(IR_PINS[0]);


void setup() {
  Serial.begin(9600);
  Serial.println("Serial started at 9600");
  IrReceiver.begin(0, ENABLE_LED_FEEDBACK);
  }

void loop() {
  //Serial.println("Loop running");
  for (uint8_t i = 0; i < NUM_RECEIVERS; i++) {
    IrReceiver.begin(IR_PINS[i], ENABLE_LED_FEEDBACK, USE_DEFAULT_FEEDBACK_LED_PIN);
    ;
    int rawlen = IrReceiver.decodedIRData.rawlen;
    delay(1);
    if (IrReceiver.decode()) {
      //Serial.print("Signal received on pin ") ;
      //Serial.print(IR_PINS[i]);
      
      // Handle which pin fired
      IrReceiver.printIRResultShort(&Serial);

      onIRReceived(IR_PINS[i]);

       // Ready for next signal
    }
    IrReceiver.resume();
  }
}
//* This works for 2 sensors. 
void onIRReceived(uint8_t pin) {
  Serial.print(" on pin ");
  Serial.println(pin);
  uint16_t command = IrReceiver.decodedIRData.command; //  Magnitude and checksum
  uint32_t fullWandID = ((uint32_t)IrReceiver.decodedIRData.extra << 16) | IrReceiver.decodedIRData.address;// wand ID
 
  IrReceiver.printIRResultShort(&Serial);
     uint8_t frame[8];
    frame[0] = 0xAA;               // Start byte
    frame[1] = (fullWandID >> 24) & 0xFF;  // ID MSB
    frame[2] = (fullWandID >> 16) & 0xFF;
    frame[3] = (fullWandID >> 8) & 0xFF;
    frame[4] = fullWandID & 0xFF;          // ID LSB
    frame[5] = (command >> 8) & 0xFF;  // Mag MSB
    frame[6] = command & 0xFF;         // Mag LSB
    frame[7] = pin & 0xFF;//* 0xFF is unnecessary but it feels right for future compatibility if we ever had more than 255 pins or if pin is not fully initialized                // Pin number
    
    Serial.write(frame, 8); 

  }