#include <DmxSimple.h>

int state = 0;
unsigned long counter = 0;

void setup() {
  DmxSimple.usePin(5);
  Serial.begin(9600);
  DmxSimple.maxChannel(3);
}

void loop() {

  while(Serial.available()) {
    serialIn();
  }

  switch(state) {
      
    case 1: // YES
      yes();
      break;

    case 6: // NO
      no();
      break;

    case 2: // GO
      go();
      break;

    case 3: // END
      ended();
      break;
      
    case 0: // STOP
      stopped();
      break;
        
  }

  counter++;

  delay(1);
  
}
