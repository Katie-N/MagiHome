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
mqtt_username = "Lucas"
mqtt_password = "JviG^xupB48h*Md"

STATE_TOPIC = b"home/pico/sensors/state"

DEVICE_INFO = {
    "identifiers": ["pico_2w_01"],
    "name": "Raspberry Pi Pico 2W",
    "model": "Pico 2W",
    "manufacturer": "Raspberry Pi"
}

# --- Connect to Wi-Fi ---
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASS)
while not wlan.isconnected():
    time.sleep(1)
print("Connected to Wi-Fi")

# --- Connect to MQTT Broker ---
client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER, port=MQTT_PORT, user=mqtt_username, password=mqtt_password)
client.connect()
print(f"Connected to {MQTT_BROKER}")

# --- Publish Discovery Configs (once on boot) ---
def publish_discovery():
    sensors = [
        {
            "unique_id": "pico_sensor_01",
            "name": "Sensor 1",
            "field": "sensor_1",
        },
        {
            "unique_id": "pico_sensor_02",
            "name": "Sensor 2",
            "field": "sensor_2",
        },
    ]
    for s in sensors:
        config = {
            "name": s["name"],
            "unique_id": s["unique_id"],
            "state_topic": "home/pico/sensors/state",
            "value_template": "{{ value_json." + s["field"] + " }}",
            "payload_on": "true",
            "payload_off": "false",
            "device": DEVICE_INFO
        }
        topic = f"homeassistant/binary_sensor/{s['unique_id']}/config"
        client.publish(topic.encode(), json.dumps(config), retain=True)
        print(f"Discovery published for {s['name']}")

publish_discovery()

# --- Initialize UART ---
uart = machine.UART(0, baudrate=9600, tx=machine.Pin(0), rx=machine.Pin(1))

# --- Main Loop ---
while True:
    if uart.any():
        number = uart.read()
        num_arr = bytearray(number)

        if hex(num_arr[0]) == '0xaa':
            wand_id = (num_arr[1] << 24) | (num_arr[2] << 16) | (num_arr[3] << 8) | (num_arr[4])
            magnitude = (num_arr[5] << 8) | (num_arr[6])
            sensor = num_arr[7]
            

            if sensor == 2:
                sensor_val = 0
            elif sensor == 5:
                sensor_val = 1
            else:
                sensor_val = 0  # safe default

            data = {
                "wandID": wand_id,
                "magnitude": magnitude,
                "sensorID": sensor_val
            }

            # --- Always publish to MQTT first (keeps HA alive even if server crashes) ---
           

            # --- Then attempt HTTP post to third-party server ---
            with open("data.json", "w") as file:
                json.dump(data, file)

            with open("data.json", "r") as f:
                payload = json.load(f)

            url = "http://192.168.12.99:3000/api/data"
            try:
                response = urequests.post(url, json=payload)
                print("Status:", response.status_code)
                print("Response:", response.text)
                response.close()
                
                if (not (200 <= response.status_code < 400)):                
                    mqtt_payload = {
                        "sensor_1": "true" if sensor_val == 0 else "false",
                        "sensor_2": "true" if sensor_val == 1 else "false"}
                    try:
                        client.publish(STATE_TOPIC, json.dumps(mqtt_payload))
                        print("MQTT state published:", mqtt_payload)
                    except Exception as e:
                        print("MQTT publish error:", e)
                        # Attempt reconnect
                        try:
                            client.connect()
                            client.publish(STATE_TOPIC, json.dumps(mqtt_payload))
                        except Exception as e2:
                            print("MQTT reconnect failed:", e2)
            except Exception as e:
                print("HTTP Error (MQTT still running):", e)

            
                