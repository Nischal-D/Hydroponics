from time import sleep_ms
from consts import Pins
from wifi import *
from preferences import *
from defaults import *

#pins = Pins()

credentials = init_credentials()
WIFI_SSID = credentials["ssid"]
WIFI_PASSWORD = credentials["password"]
DEVICE_ID = credentials["DEVICE_ID"]
SUPABASE_URL = credentials["SUPABASE_URL"]
SUPABASE_ANON_KEY = credentials["SUPABASE_ANON_KEY"]
INSERT_ENDPOINT = SUPABASE_URL + "/rest/v1/api_sensorreading"


settings = load_json("settings.json")

if settings is None:
    print("No settings.json found, using default thresholds")
    settings = DEFAULT_THRESHOLDS.copy()
    save_json("settings.json", settings)

if wifi_connect(WIFI_SSID, WIFI_PASSWORD):
    pass
else:
    print("Skipping fetch, no WiFi")
    sleep_ms(3000)


while True:
    #sleep_ms(2000)
    #pins.led.on()
    #pins.pump0.on()
    #sleep_ms(2000)
    #pins.pump0.on()
    #pins.pump1.on()
    #pins.pump2.on()
    #sleep_ms(2000)
    #pins.pump1.off()
    #pins.fan.on()
    #sleep_ms(2000)
    #pins.led.off()
    #pins.pump0.off()
    #pins.pump1.off()
    #pins.fan.off()

    #pins.print_data()
    #sleep_ms(2000)
    #pins.pump2.off()
    #pins.pump0.off()
    #pins.pump1.off()
     #Data : [{"id":1,"device_id":"esp001","pH_threshold":5.5,"ec_threshold":600,"rh_threshold":50,"pH_pmp_time":5,"ec_pmp_time":10,"rh_fan_time":15,"timestamp":"2026-02-05T08:23:41.308377+00:00"}]
    new_data = fetch_control_data(DEVICE_ID,SUPABASE_URL,SUPABASE_ANON_KEY)
    if new_data['status_code'] == 200:
    # Only update if timestamp changed
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
    sleep_ms(10000)
    #data = pins.read_data()
    #upload_sensor_data(data["ph"], data["tds"], data["dht"][0], data["dht"][1])