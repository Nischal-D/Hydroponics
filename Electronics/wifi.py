import network
from time import sleep_ms, time
import ujson
import gc
from preferences import *
from defaults import *

CREDENTIAL_FILE = "credentials.json"

def init_credentials():
    stored = load_json(CREDENTIAL_FILE)

    if stored is None:
        print("Creating credentials file...")
        save_json(CREDENTIAL_FILE, DEFAULT_CREDENTIALS)
        return DEFAULT_CREDENTIALS

    if stored != DEFAULT_CREDENTIALS:
        print("Updating credentials file...")
        save_json(CREDENTIAL_FILE, DEFAULT_CREDENTIALS)
        return DEFAULT_CREDENTIALS

    print("Using stored credentials")
    return stored

wlan = network.WLAN(network.STA_IF)

def wifi_connect(WIFI_SSID, WIFI_PASSWORD):
    if not wlan.active():
        wlan.active(True)

    if wlan.isconnected():
        return True

    print("Connecting to WiFi", end="")
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)

    timeout = 15
    start = time()

    while not wlan.isconnected():
        if time() - start > timeout:
            print("\nWiFi connect failed")
            return False
        print(".", end="")
        sleep_ms(500)

    print("\nWiFi connected:", wlan.ifconfig()[0])
    return True

def upload_sensor_data(DEVICE_ID,INSERT_ENDPOINT,SUPABASE_ANON_KEY,ph=6.6, tds=840, temperature=25, humidity=80):
    from lib import urequests

    gc.collect()

    headers = {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + SUPABASE_ANON_KEY,
        "Prefer": "return=minimal",
        "Connection": "close"
    }

    payload = {
        "device_id": DEVICE_ID,
        "ph": round(ph, 2),
        "tds": round(tds, 2),
        "humidity": round(humidity, 2),
        "temperature": round(temperature, 2)
    }

    try:
        r = urequests.post(
            INSERT_ENDPOINT,
            headers=headers,
            data=ujson.dumps(payload)
        )

        print("Upload HTTP:", r.status_code)
        r.close()
        del r
    except Exception as e:
        print("Upload error:", e)
        
def fetch_control_data(DEVICE_ID,SUPABASE_URL,SUPABASE_ANON_KEY):
    from lib import urequests
    gc.collect()

    url = (
        SUPABASE_URL +
        "/rest/v1/api_controldata"
        "?device_id=eq." + DEVICE_ID +
        "&select=*"
    )

    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + SUPABASE_ANON_KEY,
        "Accept": "application/json",
        "Connection": "close"
    }

    try:
        r = urequests.get(url, headers=headers)

        #print("Fetch HTTP:", r.status_code)
        #if r.status_code == 200:
            #print(r.text)
        code = r.status_code
        data = r.json()[0] 
        
        

        r.close()
        del r
        gc.collect()
        #sleep_ms(2000)
        if code==200:
            return {'status_code':code ,
                    'rh_threshold' : data['rh_threshold'],
                    'ec_threshold' : data['ec_threshold'],
                    'pH_threshold' : data['pH_threshold'],
                    'pH_pmp_time' : data['pH_pmp_time'],
                    'rh_fan_time' : data['rh_fan_time'],
                    'ec_pmp_time' : data['ec_pmp_time'],
                    'timestamp' : data['timestamp'] 
                    }
        return {'status_code':code}
    except Exception as e:
        print("Fetch error:", e)
        return {'status_code':400, 'data' : "error"}
        #sleep_ms(3000)