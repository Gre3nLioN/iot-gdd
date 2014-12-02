#include <Ultrasonic.h>

//Pines en los cuales se conectara el Ultrasonido
Ultrasonic ultrasonic(9,8); // (Trig PIN,Echo PIN)
Ultrasonic ultra2(11,10); // (Trig PIN,Echo PIN)

int med1 = 0;
int med2 = 0;

int buzzer =3;
int filter =0;
//sentido = 1 : entran ; sentido = 2 : salen
int sentido = 0;

void setup() {
  Serial.begin(9600); 
}

void loop()
{
  if(ultrasonic.Ranging(CM) < 45){    
    med1 = ultrasonic.Ranging(CM);
    if(sentido == 0 || sentido == 1){
      sentido = 1;
    }else{
      Serial.println(0);
      tone(buzzer, 50, 500);
      delay(1000);
      reset();
    }
  }
  if(ultra2.Ranging(CM) < 45){    
    med2 = ultrasonic.Ranging(CM);
    if(sentido == 0 || sentido == 2){
      sentido = 2;
    }else{
      Serial.println(1);
      tone(buzzer, 10, 1000); 
      delay(1000);
      reset();
    }
  }
  
  
  filter++;
  if(filter == 100){
    reset();
    filter = 0;
  }
}

void reset(){
  sentido=0;
  med1 = 0;
  med2= 0; 
}
