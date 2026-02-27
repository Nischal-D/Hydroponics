from machine import ADC, Pin
from time import sleep, sleep_ms

from lib import dht

class Pins:
    PIN_PUMP0     = 13	# NPK
    PIN_PUMP1     = 22	# CaNO3
    PIN_PUMP2     = 26	# PH
    PIN_FAN       = 23
    PIN_TDS       = 35
    PIN_DHT       = 32
    PIN_PH1       = 34
    PIN_PH2       = 33
    PIN_PH_TOGGLE = 21
    MID_PH = 1.17128
    CALIBRATION_FACTOR = -0.0649
    READ_INTERVAL_MS = 60000

    def __init__(self):
        self.pump0 = Pin(self.PIN_PUMP0, Pin.OUT)
        self.pump1 = Pin(self.PIN_PUMP1, Pin.OUT)
        self.pump2 = Pin(self.PIN_PUMP2, Pin.OUT)
        self.fan   = Pin(self.PIN_FAN, Pin.OUT)

        self.tds 	= ADC(Pin(self.PIN_TDS))
        self.dht22 	= dht.DHT22(Pin(self.PIN_DHT))
        self.ph0  	= ADC(Pin(self.PIN_PH1))
        self.ph1 	= ADC(Pin(self.PIN_PH2))
        self.phToggle = Pin(self.PIN_PH_TOGGLE, Pin.OUT)

        for adc in (self.ph0, self.ph1, self.tds):
            adc.atten(ADC.ATTN_11DB)
            
    def flashPH(self):
        self.phToggle.on()
        sleep_ms(100)
        self.phToggle.off()
    
    def read_data(self):
        tds = 0
        for i in range(10):
            sleep_ms(2)
            tds += self.tds.read()
        tds /= 10
        try:
            self.dht22.measure()
        except Exception as e:
           return { "tds"	: tds,
                    "dht"	: [18, 74],
                    "ph"	: self.read_ph_data()['ph']}
        
        return {"tds"	: tds,
                "dht"	: [self.dht22.temperature(), self.dht22.humidity()],
                "ph"	: self.read_ph_data()['ph']}
    
    def read_ph_data(self):
        if self.ph0.read_uv()==142000 and self.ph1.read_uv()==142000:
           self.flashPH()
           sleep(10)
        ph0 = 0 
        for i in range(100):
            sleep_ms(5)
            ph1 += self.ph1.read_uv() / 1e6
        
        ph0 /= 100
        
        data =  {"ph"	: 7 - (self.MID_PH - ph0) / self.CALIBRATION_FACTOR,
                "ph0"	: ph0}
        return data
        

    def print_data(self):
        try:
            self.dht22.measure()
        except Exception as e:
            print(
                "TDS:", self.tds.read(),
                "DHT:", 18, 74,
                "ph : ", self.read_ph_data()['ph']
            )
            return
        print(
            "TDS:", self.tds.read(),
            "DHT:", self.dht22.temperature(), self.dht22.humidity(),
            "ph" ,  self.read_ph_data()['ph']
        )