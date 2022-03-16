
void no() {
  
  int red = (counter%500 < 250) * 255;

  DmxSimple.write(1, red);
  DmxSimple.write(2, 0);
  DmxSimple.write(3, 0);
  
}
