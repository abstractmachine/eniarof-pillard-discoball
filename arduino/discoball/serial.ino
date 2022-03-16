
void serialIn() {

  int character = Serial.read();

  switch(character) {
      
    case 'Y':
      state = 1;
      break;

    case 'N':
      state = 6;
      break;

    case 'G':
      state = 2;
      break;

    case 'S':
      state = 0;
      break;

    case 'E':
      state = 3;
      break;
        
  }
    
}
