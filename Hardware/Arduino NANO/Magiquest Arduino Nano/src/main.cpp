#include <Arduino.h>
#define DECODE_MAGIQUEST

#define IR_RECEIVE_PIN_OF_SECOND_RECEIVER   5
#define SUPPORT_MULTIPLE_RECEIVER_INSTANCES
void UserIRReceiveTimerInterruptHandler(); // Is defined below and must be declared before line #include <IRremote.hpp>

#include "PinDefinitionsAndMore.h" // Define macros for input and output pin etc. Sets FLASHEND and RAMSIZE and evaluates value of SEND_PWM_BY_TIMER.
#include <IRremote.hpp> // include the library

IRrecv MySecondIrReceiver(IR_RECEIVE_PIN_OF_SECOND_RECEIVER); // This sets the pin for the second instance

void handleSuccessfulDecoding(IRrecv *aIRReceiverInstance);

void setup() {
    Serial.begin(9600);

    // Just to know which program is running on my Arduino
    //Serial.println(F("START " __FILE__ " from " __DATE__ "\r\nUsing library version " VERSION_IRREMOTE));

    // Start the receiver and if not 3. parameter specified, take LED_BUILTIN pin from the internal boards definition as default feedback LED
    IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK); // This sets the pin for the default / first instance and enables the global LED feedback

    Serial.print(F("Ready to receive IR signals of protocols: "));
    //printActiveIRProtocols(&Serial);
    Serial.println(F("at pin " STR(IR_RECEIVE_PIN) " and pin " STR(IR_RECEIVE_PIN_OF_SECOND_RECEIVER)));
}

void loop() {
    /*
     * Check if received data is available and if yes, try to decode it.
     * Decoded result is in the IrReceiver.decodedIRData structure.
     *
     * E.g. command is in IrReceiver.decodedIRData.command
     * address is in command is in IrReceiver.decodedIRData.address
     * and up to 32 bit raw data in IrReceiver.decodedIRData.decodedRawData
     */
    if (IrReceiver.decode()) {
        handleSuccessfulDecoding(&IrReceiver);
    }
    if (MySecondIrReceiver.decode()) {
        handleSuccessfulDecoding(&MySecondIrReceiver);
    }
}

void handleSuccessfulDecoding(IRrecv *aIRReceiverInstance) {
  if (aIRReceiverInstance->decodedIRData.rawlen == 112){

    Serial.print(F("Receiver at pin "));
    Serial.print(aIRReceiverInstance->irparams.IRReceivePin);
    Serial.print(F(": "));

  }
  
        aIRReceiverInstance->resume(); // Early enable receiving of the next IR frame

        aIRReceiverInstance->printIRResultShort(&Serial);
       // aIRReceiverInstance->printIRSendUsage(&Serial);
    
    Serial.println();

    /*
     * Finally, check the received data and perform actions according to the received command
     */
    if (aIRReceiverInstance->decodedIRData.flags & IRDATA_FLAGS_IS_REPEAT) {
        Serial.println(F("Repeat received. Here you can repeat the same action as before."));
    } else {
        if (aIRReceiverInstance->decodedIRData.command == 0x10) {
            Serial.println(F("Received command 0x10."));
            // do something
        } else if (aIRReceiverInstance->decodedIRData.command == 0x11) {
            Serial.println(F("Received command 0x11."));
            // do something else
        }
    }

}

/*
 * If SUPPORT_MULTIPLE_RECEIVER_INSTANCES is active, this handler is called in ISR context after IrReceiver.ReceiveInterruptHandler().
 * Here we just call the standard ReceiveInterruptHandler for the second receiver.
 * Doing it this way, we are able to modify the body of this function to support more than 2 IRrecv instances for receiving.
 */
#if defined(ESP8266) || defined(ESP32)
IRAM_ATTR
#endif
void UserIRReceiveTimerInterruptHandler() {
    MySecondIrReceiver.ReceiveInterruptHandler();
}

//* This works for 2 sensors. 
// void onIRReceived(uint8_t pin) {
//   uint16_t command = IrReceiver.decodedIRData.command; //  Magnitude and checksum
//   uint32_t fullWandID = ((uint32_t)IrReceiver.decodedIRData.extra << 16) | IrReceiver.decodedIRData.address;// wand ID
//   //Serial.print(" on pin ");
//  // Serial.println(pin);
 
 
  //IrReceiver.printIRResultShort(&Serial);
  //    uint8_t frame[8];
  //   frame[0] = 0xAA;               // Start byte
  //   frame[1] = (fullWandID >> 24) & 0xFF;  // ID MSB
  //   frame[2] = (fullWandID >> 16) & 0xFF;
  //   frame[3] = (fullWandID >> 8) & 0xFF;
  //   frame[4] = fullWandID & 0xFF;          // ID LSB
  //   frame[5] = (command >> 8) & 0xFF;  // Mag MSB
  //   frame[6] = command & 0xFF;         // Mag LSB
  //   frame[7] = pin & 0xFF;//* 0xFF is unnecessary but it feels right for future compatibility if we ever had more than 255 pins or if pin is not fully initialized                // Pin number
    
  //   Serial.write(frame, 8); 

  // }