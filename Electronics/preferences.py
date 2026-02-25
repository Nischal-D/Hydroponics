import ujson
import gc    
from machine import Pin
from time import sleep_ms

def save_json(filename, data):
    with open(filename, "w") as f:
        ujson.dump(data, f)
    gc.collect()
    
def load_json(filename):
    try:
        with open(filename, "r") as f:
            return ujson.load(f)
    except:
        return None