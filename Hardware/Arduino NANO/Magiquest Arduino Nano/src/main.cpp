#include <Arduino.h>
#define DECODE_MAGIQUEST

#define IR_RECEIVE_PIN_OF_SECOND_RECEIVER 5
#define SUPPORT_MULTIPLE_RECEIVER_INSTANCES
void UserIRReceiveTimerInterruptHandler();

#include "PinDefinitionsAndMore.h" // sets IR_RECEIVE_PIN to 2 by default
#include <IRremote.hpp>

IRrecv MySecondIrReceiver(IR_RECEIVE_PIN_OF_SECOND_RECEIVER);

void sendFrame(IRrecv *receiver);

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK);
}

void loop() {
  if (IrReceiver.decode()) {
    sendFrame(&IrReceiver);
    IrReceiver.resume();
  }
  if (MySecondIrReceiver.decode()) {
    sendFrame(&MySecondIrReceiver);
    MySecondIrReceiver.resume();
  }
}

void sendFrame(IRrecv *receiver) {
  if (receiver->decodedIRData.rawlen != 112) return; // filter non-MagiQuest packets

  uint16_t command    = receiver->decodedIRData.command;
  uint32_t fullWandID = ((uint32_t)receiver->decodedIRData.extra << 16)
                      | receiver->decodedIRData.address;
  uint8_t  pin        = receiver->irparams.IRReceivePin;

  uint8_t frame[8];
  frame[0] = 0xAA;
  frame[1] = (fullWandID >> 24) & 0xFF;
  frame[2] = (fullWandID >> 16) & 0xFF;
  frame[3] = (fullWandID >> 8)  & 0xFF;
  frame[4] =  fullWandID        & 0xFF;
  frame[5] = (command >> 8)     & 0xFF;
  frame[6] =  command           & 0xFF;
  frame[7] =  pin;
  //Serial.print(pin);
  Serial.write(frame, 8);
}

void UserIRReceiveTimerInterruptHandler() {
  MySecondIrReceiver.ReceiveInterruptHandler();
}