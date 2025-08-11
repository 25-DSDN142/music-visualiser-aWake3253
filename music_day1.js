colorMode(HSB);
function draw_one_frame(words, vocal, drum, bass, other, counter) {
    background(20)
    drumSize = map(drum, 0, 100, 50, 400);  
    bassSize = map(bass, 0, 100, 50, 400);  
    wordSize = map(vocal,0, 700, 60, 600)

    let amplitude = drumSize/2;
    let frequency = 0.02*bassSize;
    let hueValue = (counter*2) %360;
    let changingColor = color(hueValue, 100, 100);
    colorMode(RGB);
    for (var i = 0; i<5; i++){   
      let yOffset = i*40;
      let phase = i*PI/9;
       drawWave(amplitude, frequency, counter, yOffset, phase);
      }

    fill(255, 100, 50)
    ellipse(width/2, height/2, bassSize, drumSize);

    fill(100, 100, 50);
    ellipse(width/2, height/2, drumSize, bassSize);
    fill(167, 120, 30);

    


    textAlign(CENTER);
    textSize(wordSize);
    fill(changingColor);
    text(words, wordSize+width/3, height/4);
}
   
function drawWave(amplitude, frequency, counter, yOffset, phase){
  stroke (255);
  noFill();
  beginShape();
  for (var i = 0; i < width; i++){
    let x = i;
    let y = height/2.4+ yOffset+ amplitude * sin(frequency* x +(counter*0.05) +phase);
    vertex(x, y);
  }
endShape();
noStroke();
}



