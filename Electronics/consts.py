from machine import ADC, Pin

from lib import dht

class Pins:
    PIN_PUMP0     = 13
    PIN_PUMP1     = 26
    PIN_PUMP2     = 22
    PIN_FAN       = 23
    PIN_TDS       = 35
    PIN_DHT       = 32
    PIN_PH1       = 34
    PIN_PH2       = 33

    READ_INTERVAL_MS = 60000

    def __init__(self):
        self.pump0 = Pin(self.PIN_PUMP0, Pin.OUT)
        self.pump1 = Pin(self.PIN_PUMP1, Pin.OUT)
        self.pump2 = Pin(self.PIN_PUMP2, Pin.OUT)
        self.fan   = Pin(self.PIN_FAN, Pin.OUT)

        self.tds 	= ADC(Pin(self.PIN_TDS))
        self.dht22 	= dht.DHT22(Pin(self.PIN_DHT))
        self.ph1  	= ADC(Pin(self.PIN_PH1))
        self.ph2 	= ADC(Pin(self.PIN_PH2))

        for adc in (self.ph1, self.ph2, self.tds):
            adc.atten(ADC.ATTN_11DB)
    def read_data(self):
        try:
            self.dht22.measure()
        except Exception as e:
           return { "tds"	: self.tds.read(),
                    "dht"	: [0, 0],
                    "ph0"	: self.ph0.read(),
                    "ph1"	: self.ph1.read()}
        
        return {"tds"	: self.tds.read(),
                "dht"	: [self.dht22.temperature(), self.dht22.humidity()],
                "ph0"	: self.ph0.read(),
                "ph1"	: self.ph1.read()}

    def print_data(self):
        try:
            self.dht22.measure()
        except Exception as e:
            print(
                "TDS:", self.tds.read(),
                "DHT:", 74, 18,
                "ph", self.ph1.read_uv() - self.ph2.read_uv()
            )
            return
        print(
            "TDS:", self.tds.read(),
            "DHT:", self.dht22.temperature(), self.dht22.humidity(),
            "PH0:",  self.ph0.read(),
            "PH1:",  self.ph1.read(),
            "PH:",  self.ph1.read() - self.ph0.read()
        )