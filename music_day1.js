let barHeights = [];
let barColors = [];
let ellipseColors = [];

function randomColorPalette(){ //allows user to edit/add colours to the color palette
let colorPalette = [
color(74, 219, 200, 180),
color(92, 171, 125, 180),
color(90, 147, 103, 180),
];
return colorPalette[int(random(colorPalette.length))];
}

function initialiseBarColors(numBars){
  barColors = [];
  for (let i = 0; i<numBars; i++ ){
    barColors.push(randomColorPalette());
  }
}


function initialiseEllipseColors(rows, cols){
  ellipseColors = [];
  for (let row = 0; row < rows; row++){
  ellipseColors[row] = [];
  for (let col = 0; col < cols; col++){
    ellipseColors[row][col] = [
      randomColorPalette(),
      randomColorPalette()
    ]
    }
  }
}

function draw_one_frame(words, vocal, drum, bass, other, counter) {
    background(20)
    drawSpectrum(drum, bass, vocal, other, width, height, counter);

    let drumSize = map(drum, 0, 100, 50, 400);  
    let bassSize = map(bass, 0, 100, 50, 400);  
    let wordSize = map(vocal,0, 700, 60, 600)

    let amplitude = -drumSize/1.1;
    let frequency = 0.007*-bassSize;
    let hueValue = (counter*2) %360;
    let changingColor = color(hueValue, 100, 100);
    push();
    colorMode(RGB);
    for (var i = 0; i<5; i++){   
      let yOffset = i*40;
      let phase = i*100;
       drawWave(amplitude, frequency, counter, yOffset, phase);
      }
    pop();
    drawEllipse(width, height, bassSize, drumSize);
    drawWords(words, wordSize, changingColor, width, height)
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

function drawWords(words, wordSize, changingColor, width, height){
  textAlign(CENTER);
  textSize(wordSize);
  fill(changingColor);
  text(words, wordSize+width/3, height/4);
}

function drawEllipse(width, height, bassSize, drumSize){
  let rows = 5;
  let cols = 5;
  let xSpace = width / (cols+0.9);
  let ySpace = height / (rows +1);
  if (ellipseColors.length === 0) initialiseEllipseColors(rows, cols);


  for (let row = 1; row <=rows; row++){
    for (let col = 1; col <= cols; col++){
      let x = xSpace * col;
      let y = ySpace * row;

      if ((row + col) %2 ==0){
            fill(ellipseColors[row-1][col-1][0]);
            ellipse(x, y, bassSize/2, drumSize/2);
            fill(ellipseColors[row-1][col-1][1]);
            ellipse(x, y, drumSize/2, bassSize/2);
      }
    }
  }
}

function drawSpectrum (drum, bass, vocal, other, width, height, counter){
  colorMode(RGB);
  let numBars = 60;
  let barWidth = width/ numBars;

  if (barHeights.length != numBars){
    barHeights = new Array(numBars).fill(0);
    initialiseBarColors(numBars);
  }

  for (let i=0; i<numBars; i++){
    let t = i/numBars;
    let value = (
      drum * (1-t) *0.8 + 
      bass * sin(t*PI) + 
      vocal *t*0.5 + 
      other * noise(t*5, counter*0.01));
    
    let targetH = map(value, 0, 100, 0, height*0.7);
    barHeights[i] = lerp(barHeights[i], targetH, 0.2)
  }
noStroke();
for (let i = 0; i<numBars; i++){
  let h = barHeights[i];
  fill(barColors[i]);
  rect(i*barWidth, height-h, barWidth-2, h)
  }
}

