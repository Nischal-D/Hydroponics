from machine import ADC, Pin

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
        self.phToggle = Pin(21, Pin.OUT)

        for adc in (self.ph0, self.ph1, self.tds):
            adc.atten(ADC.ATTN_11DB)
            
    def flashPH():
        self.phToggle.on()
        sleep_ms(100)
        self.phToggle.off()
    
    def read_ph_data(self):
        if self.ph0.read() == 0 and self.ph1.read() == 0:
            self.flashPH()
            sleep_ms(500)
        return {"ph"	: self.ph0.read() - self.ph1.read()}
    
    def read_data(self):
        try:
            self.dht22.measure()
        except Exception as e:
           return { "tds"	: self.tds.read(),
                    "dht"	: [18, 74],
                    "ph"	: self.read_ph_data()['ph']}
        
        return {"tds"	: self.tds.read(),
                "dht"	: [self.dht22.temperature(), self.dht22.humidity()],
                "ph"	: self.read_ph_data()['ph']}
    def read_ph_data(self):
        if self.ph0.read() == 0 and self.ph1.read() == 0:
            self.flashPH()
            sleep_ms(500)
        return {"ph"	: 7+((2.5 - (self.ph0.read_uv() - self.ph1.read_uv())/1e6)/0.1841)}

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