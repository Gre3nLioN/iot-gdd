#include <SPI.h>
#include <Ethernet.h>
#include "DHT.h"

//Sensors
#define DHTPIN 2      //Dht11 in pin 2
#define DHTTYPE DHT11
#define ground 1 // humidity ground in pin A1

DHT dht(DHTPIN, DHTTYPE);

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
unsigned int port = 3000;
String server = "192.168.1.100";  //here IP to connect with
String postPath = "/api/v1/plant/stats";
String getPath = "/api/v1/plant/status";
float time=0.0f;
#define TIMER_DELAY 1.0f
float timer=TIMER_DELAY;

IPAddress ip(192,168,0,177);

EthernetClient client;

bool posting; // or getting
char Status;
double T2,H; //DHT11 values
double soilHumidity; //Humidity value

#define PIN_VENTILADOR 42
#define PIN_LAMPARITA 44

void setup() {
  Serial.begin(115200);  
  Serial.println("Start");
  dht.begin();
  while (!Serial) {
  }

  if (Ethernet.begin(mac) == 0) {    
    Serial.println("Failed to configure Ethernet using DHCP");
    Ethernet.begin(mac, ip);
  }
  
  // give the Ethernet shield a second to initialize:
  delay(1000);
  Serial.println("connecting...");

  // if you get a connection, report back via serial:
  if (client.connect(server.c_str(), port)) {    
    Serial.println("connected");
  } 
  else {
    // kf you didn't get a connection to the server:
    Serial.println("connection failed");
  }
  
  pinMode(PIN_LAMPARITA,OUTPUT);
  pinMode(PIN_VENTILADOR,OUTPUT);
  digitalWrite(PIN_LAMPARITA,HIGH);
  digitalWrite(PIN_VENTILADOR,HIGH);

  time=millis()/1000.0f;
  posting=true;

}

void loop()
{
 float t = millis()/1000.0f;
  float dt = t - time;
  time = t; 
  // if there are incoming bytes available 
  // from the server, read them and print them:
  if(client.available()){
    String response="";
    while(client.available()){
      response+=(char)client.read();
    }
    //Serial.println(response);
    if(!posting){
     String accionar = parsearMensaje(response.c_str(),response.length());
     Acciones(accionar); 
    }
    posting=!posting;
    timer=TIMER_DELAY;
  }
  
  if(timer>0.0f){
    timer-=dt;
    if(timer<=0.0f){
      if(posting){
        leerSensores();
        //JSON: {"temp":"T","soilHumidity":"soilHumidity","humidity":"H"}
        String body = "{\"temp\":\"";
        body += T2;
        body += "\",\"soilHumidity\":\"";
        body += soilHumidity;
        body += "\",\"humidity\":\"";
        body += H;
        body += "\"}";
        Serial.print("Posteo: ");
        Serial.println(body);
        postearMensaje(body.c_str(),body.length());
      }else{
        Serial.print("Getter: ");
        getterMensaje();
      }
    }
  }
  
  // if the server's disconnected, stop the client:
  if (!client.connected()) {
    Serial.println();
    Serial.println("disconnecting.");
    client.stop();
    
    // do nothing forevermore:
    delay(1000);
    setup();
  }
}

void leerSensores() {
  T2 = dht.readTemperature();
  H = dht.readHumidity();
  soilHumidity = analogRead(ground);
  
  Serial.println(T2);   
  Serial.println(H);
  Serial.println(soilHumidity);  
}

void postearMensaje(const char * body, unsigned int len) {
  // Make a HTTP request:                     
  client.print("POST ");
  client.print(postPath);
  client.println(" HTTP/1.1");
  client.print("Host: ");
  client.println(server);
  client.println("Connection: keep-alive");
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.println(len);
  client.println();
  client.println(body);  
}

void getterMensaje() {
  // Make a HTTP request:                     
  client.print("GET ");
  client.print(getPath);
  client.println(" HTTP/1.1");
  client.print("Host: ");
  client.println(server);
  client.println("Connection: keep-alive");
  client.println();
}

String parsearMensaje(const char * response, unsigned int len) {
    for(int i=0;i<len;i++){
      if(response[i]=='"' && response[i+1]=='/'){
        int j=i+2;
        String str="";
        while(response[j]!='"')
          str+=response[j++];
        Serial.print("Recibo: ");
        Serial.println(str);
        return str;
      }
   }
}

void Acciones(String actuar){
  if(actuar.equals("COLD")){
    Serial.println("COLD");
    //Cooler ON
    digitalWrite(PIN_VENTILADOR,LOW);
    //Light OFF
    digitalWrite(PIN_LAMPARITA,HIGH);
  }
  else if(actuar.equals("WARM")){
    Serial.println("WARM");
    //Light ON
    digitalWrite(PIN_LAMPARITA,LOW);
    //Cooler OFF
    digitalWrite(PIN_VENTILADOR,HIGH);
  }
  else{
    //Cooler OFF
    digitalWrite(PIN_VENTILADOR,HIGH);
    //Light OFF
    digitalWrite(PIN_LAMPARITA,HIGH);
  }
}
