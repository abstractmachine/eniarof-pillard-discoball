
void go() {

  int red   = (counter) % 255;
  int green = (counter+128) % 255;
  int blue  = (counter+64) % 255;
  
  DmxSimple.write(1, red);
  DmxSimple.write(2, green);
  DmxSimple.write(3, blue);
  
}
