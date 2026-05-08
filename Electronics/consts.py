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
    PIN_TDS_CONTROL = 19
    PIN_PH1       = 34
    PIN_PH2       = 33
    PIN_PH_TOGGLE = 21
    MID_PH = 1.180
    CALIBRATION_FACTOR = -0.05196
    READ_INTERVAL_MS = 60000

    def __init__(self):
        self.pump0 = Pin(self.PIN_PUMP0, Pin.OUT)
        self.pump1 = Pin(self.PIN_PUMP1, Pin.OUT)
        self.pump2 = Pin(self.PIN_PUMP2, Pin.OUT)
        self.fan   = Pin(self.PIN_FAN, Pin.OUT)
        self.tds 	= ADC(Pin(self.PIN_TDS))
        self.dht22 	= dht.DHT22(Pin(self.PIN_DHT))
        self.tdsControl = Pin(self.PIN_TDS_CONTROL, Pin.OUT)
        self.ph0  	= ADC(Pin(self.PIN_PH1))
        self.ph1 	= ADC(Pin(self.PIN_PH2))
        self.phToggle = Pin(self.PIN_PH_TOGGLE, Pin.OUT)
        
        self.pump0.off()
        self.pump1.off()
        self.pump2.off()
        self.fan.off()

        for adc in (self.ph0, self.ph1, self.tds):
            adc.atten(ADC.ATTN_11DB)
            
    def flashPH(self):
        self.phToggle.on()
        sleep_ms(100)
        self.phToggle.off()
    
    def read_data(self):
        self.tdsControl.on()
        sleep(1)
        tds = 0
        for i in range(10):
            sleep_ms(2)
            tds += self.tds.read()
        tds /= 10
        self.tdsControl.off()
        self.read_ph_data()
        sleep(60)
        try:
            self.dht22.measure()
        except Exception as e:
            self.tdsControl.off()
            return {"tds"	: tds,
                    "dht"	: [0,0],
                    "ph"	: self.read_ph_data()['ph']}
        dhtData = [self.dht22.temperature(), self.dht22.humidity()]
        
        return {"tds"	: tds,
                "dht"	: dhtData,
                "ph"	: self.read_ph_data()['ph']}
    
    def read_ph_data(self):
        if int(self.ph0.read_uv())== 142000:
           self.flashPH()
           sleep(10)
        ph0 = 0 
        for i in range(100):
            sleep_ms(5)
            ph0 += self.ph0.read_uv() / 1e6
        
        ph0 /= 100
        ph = 7 - (self.MID_PH - ph0) / self.CALIBRATION_FACTOR
        data =  {"ph"	: ph}
        return data
        

    def print_data(self):
        self.tdsControl.on()
        sleep(1)
        tds = 0
        for i in range(10):
            sleep_ms(2)
            tds += self.tds.read()
        tds /= 10
        self.tdsControl.off()
        try:
            self.dht22.measure()
        except Exception as e:
            print(
                "TDS:", tds,
                "DHT:", 0, 0,
                "ph : ", self.read_ph_data()['ph']
            )
            return
        dhtData = [self.dht22.temperature(), self.dht22.humidity()]
        print(
            "TDS:", tds,
            "DHT:", dhtData[0], dhtData[1],
            "ph" ,  self.read_ph_data()['ph']
        )

