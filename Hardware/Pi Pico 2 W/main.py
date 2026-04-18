import machine
import time
import network
from umqtt.simple import MQTTClient
import json
import urequests

# --- Configuration ---
WIFI_SSID = "arctic"
WIFI_PASS = "BreadofLife!"
MQTT_BROKER = "192.168.12.243" 
MQTT_PORT = 1883
MQTT_CLIENT_ID = "pico2w_client"
MQTT_TOPIC = b"pico2w/test"
mqtt_username = "Lucas"
mqtt_password = "JviG^xupB48h*Md"

# --- Connect to Wi-Fi ---
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASS)
while not wlan.isconnected():
    time.sleep(1)
print("Connected to Wi-Fi")

 --- Connect to MQTT Broker ---
client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER, port=MQTT_PORT, user=mqtt_username,  password=mqtt_password)
client.connect()
 print(f"Connected to {MQTT_BROKER}")
 --- Publish Message ---
 config = {
    "name": "Pico Sensors",
    "unique_id": "pico__01",
    "state_topic": "home/pico/sensor",
    "unit_of_measurement": "°C",
    "device_class": "temperature",
    "value_template": "{{ value_json.temperature }}",
    "device": {
        "identifiers": [CLIENT_ID],
        "name": "Raspberry Pi Pico 2W",
        "model": "Pico 2W",
        "manufacturer": "Raspberry Pi"
    }
}
try:
    message = b"Hello from Pico 2W"
    client.publish(MQTT_TOPIC, message)
     print(f"Published: {message} to {MQTT_TOPIC}")
     # Publish every 5 seconds
except KeyboardInterrupt:
        client.disconnect()

# Initialize UART
uart = machine.UART(0, baudrate=9600, tx=machine.Pin(0), rx=machine.Pin(1))
 

# Check if anything is waiting in the RX buffer
while True:
    if uart.any():
        number = uart.read()
        num_arr = bytearray(number)
        if hex(num_arr[0]) == '0xaa':
            wand_id = (num_arr[1] << 24) | (num_arr[2] << 16) | (num_arr[3] << 8) | (num_arr[4])
            #print(wand_id)
            magnitude = (num_arr[5] << 8)| (num_arr[6])
            sensor = num_arr[7]
            print(sensor)
            if sensor == 2:
                sensor_val = 0
            elif sensor == 5:
                sensor_val = 1
   

            # Your data (dictionary or list)
            data = {
                "WandID": wand_id,
                "magnitude": magnitude,
                "sensor": sensor_val
            }

            # Writing to a file
            with open("data.json", "w") as file:
                json.dump(data, file)
                file.close()
            # 1. Load data from the local JSON file
            with open('data.json', 'r') as f:
                payload = json.load(f)

                # 2. Push to the target IP address
                url = 'http://192.168.12.99:3000'
                # 10.154.115.99:3000
                try:
                    response = urequests.post(url, json=payload)
                    print("Status:", response.status_code)
                    print("Response:", response.text)
                    response.close() # Always close to free memory
                except Exception as e:
                    
                    print("Error:", e)
        
