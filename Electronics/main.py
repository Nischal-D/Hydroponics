from time import sleep_ms, sleep
from consts import Pins
from wifi import *
from preferences import *
from defaults import *
from machine import ADC, Pin

READ_DELAY = 600
STABILIZATION_DELAY = 300

pins = Pins()

credentials = init_credentials()
INSERT_ENDPOINT = credentials["SUPABASE_URL"] + "/rest/v1/api_sensorreading"
settings = load_json("settings.json")

if settings is None:
    print("No settings.json found, using default thresholds")
    settings = DEFAULT_THRESHOLDS.copy()
    save_json("settings.json", settings)


def checkSettings():
    new_data = fetch_control_data(credentials["DEVICE_ID"],credentials["SUPABASE_URL"],credentials["SUPABASE_ANON_KEY"])
    if new_data['status_code'] == 200:
        if settings.get("last_timestamp") != new_data["timestamp"]:
            print("New thresholds detected")

            settings.update({
                "rh_threshold": new_data["rh_threshold"],
                "ec_threshold": new_data["ec_threshold"],
                "pH_threshold": new_data["pH_threshold"],
                "pH_pmp_time": new_data["pH_pmp_time"],
                "ec_pmp_time": new_data["ec_pmp_time"],
                "rh_fan_time": new_data["rh_fan_time"],
                "last_timestamp": new_data["timestamp"]
            })

            save_json("settings.json", settings)
        print(f'''rh_threshold = {settings['rh_threshold']}
                    ec_threshold = {settings['ec_threshold']}
                    pH_threshold = {settings['pH_threshold']}
                    pH_pmp_time= {settings['pH_pmp_time']}
                    rh_fan_time = {settings['rh_fan_time']}
                    ec_pmp_time = {settings['ec_pmp_time']}
                    timestamp= {settings['last_timestamp']}\n''')

while True:
    # Data Acquire
    data = pins.read_data()
    
    # Data storage
    save_offline(data)
    
    # EC comparision
    if data['tds'] < settings['ec_threshold']:
        pins.pump0.on()
        pins.pump1.on()
        sleep_ms(settings['ec_pmp_time'])
        pins.pump0.off()
        pins.pump1.off()
        sleep(STABILIZATION_DELAY)
        data['ph'] = pins.read_ph_data()
    
    # ph comparision
    if data['ph'] < settings['pH_threshold']:
        pins.pump2.on()
        sleep_ms(settings['pH_pmp_time'])
        pins.pump2.off()
        
    # rh comparision
    if data['dht'][1] < settings['rh_threshold']:
        pins.fan.on()
        sleep_ms(settings['rh_fan_time'])
        pins.fan.off()
        
    # try to upload stored data
    if not isWifiConnected():
        wifi_connect(credentials['wifi_networks'])
    
    if isWifiConnected():
        flush_offline_data(credentials,INSERT_ENDPOINT)
    
    # check for new thresholds
    checkSettings()
    
    data = pins.read_data()
    upload_sensor_data(credentials["DEVICE_ID"],INSERT_ENDPOINT,credentials["SUPABASE_ANON_KEY"],data["ph"], data["tds"], data["dht"][0], data["dht"][1])
    sleep(READ_DELAY)

