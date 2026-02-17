from machine import ADC, Pin

#from lib import dht

class Pins:
    PIN_PUMP0     = 13
    PIN_PUMP1     = 26
    PIN_PUMP2     = 22
    PIN_FAN       = 23
    PIN_TDS       = 35
    PIN_DHT       = 32
    PIN_PH        = 34

    READ_INTERVAL_MS = 60000

    def __init__(self):
        self.pump0 = Pin(self.PIN_PUMP0, Pin.OUT)
        self.pump1 = Pin(self.PIN_PUMP1, Pin.OUT)
        self.pump2 = Pin(self.PIN_PUMP2, Pin.OUT)
        self.fan   = Pin(self.PIN_FAN, Pin.OUT)

        self.tds 	= ADC(Pin(self.PIN_TDS))
        #self.dht22 	= dht.DHT22(Pin(self.PIN_DHT))
        self.ph  	= ADC(Pin(self.PIN_PH))

        for adc in (self.tds, self.ph):
            adc.atten(ADC.ATTN_11DB)
    def read_data(self):
        #self.dht22.measure()
        return {"tds"	: self.tds.read(),
                #"dht"	: [self.dht22.temperature(), self.dht22.humidity()],
                "ph"	: 7+(2.9-self.ph.read_uv()/1e6)}

    def print_data(self):
        #self.dht22.measure()
        print(
            "TDS:", self.tds.read(),
            #"DHT:", self.dht22.temperature(), self.dht22.humidity(),
            "PH:",  7+(2.9-self.ph.read_uv()/1e6)
        )
    
