import machine
import time

# Initialize UART
uart = machine.UART(0, baudrate=9600, tx=machine.Pin(0), rx=machine.Pin(1))
 

# Check if anything is waiting in the RX buffer
while True:
    if uart.any():
        number = uart.read()
        print("Received:", number)
        print(number.hex(' '))
        num_arr = bytearray(number)
        if hex(num_arr[0]) == '0xaa':
            wand_id = (num_arr[1] << 24) | (num_arr[2] << 16) | (num_arr[3] << 8) | (num_arr[4])
            print(hex(wand_id))
            magnitude = (num_arr[5] << 8)| (num_arr[6])
            sensor = num_arr[7]
            print(sensor)
        
