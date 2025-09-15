//initialises arrays as empty
let barHeights = [];
let barColors = [];
let ellipseColors = [];
let chorusPalette = null;

function colorPalette() { //allows user to edit/add colours to the inbetween color palette (word, bar and ellipse), picks random combo
  let colorPalette = [
    color(54, 80, 193),
    color(228, 115, 187, 180),
    color(137, 204, 241, 180),
    color(159, 105, 211, 180),
    color(245, 187, 225, 180)
  ];
  return colorPalette[int(random(colorPalette.length))];
}

function chorusColor(counter, index) { //selects colors for the chorus color Palette
  if (!chorusPalette)
    chorusPalette = [
      color(228, 115, 187),
      color(137, 204, 241),
      color(159, 105, 211),
      color(245, 187, 225)
    ];

  //functions/variables for the chorus changing color cycle
  let speed = 120;
  let t = (counter / speed + index) % chorusPalette.length;

  let i1 = floor(t);
  let i2 = (i1 + 1) % chorusPalette.length;

  let amt = t - i1
  return lerpColor(chorusPalette[i1], chorusPalette[i2], amt)
}

function initialiseBarColors(numBars) { //bar color initialisation
  barColors = [];
  for (let i = 0; i < numBars; i++) {
    barColors.push(colorPalette());
  }
}

function initialiseEllipseColors(rows, cols) { //initialises the changing colors for the ellipses
  ellipseColors = [];
  for (let row = 0; row < rows; row++) {
    ellipseColors[row] = [];
    for (let col = 0; col < cols; col++) {
      ellipseColors[row][col] = [
        colorPalette(),
        colorPalette()
      ]
    }
  }
}

function draw_one_frame(words, vocal, drum, bass, other, counter) { //function to run every frame, initialises sound maps and draws fumctions
  background(20)
  fill(255);
  
  drawSpectrum(drum, bass, vocal, other, width, height, counter);

  //maps for bass, drum, vocal and color changing parts
  let drumSize = map(drum, 0, 100, 50, 400);
  let bassSize = map(bass, 0, 100, 50, 400);
  let wordSize = map(vocal, 0, 700, 60, 600)

  let amplitude = -drumSize / 3;
  let frequency = 0.004 * -bassSize;
  let hueValue = (counter * 2) % 360;
  let changingColor = color(hueValue, 100, 100);
  push();
  colorMode(RGB);

  //draw functions and boundaries
  for (var i = 0; i < 5; i++) {
    let yOffset = i * 40;
    let phase = i * 100;
    if ((counter > 1 && counter <= 2755) || (counter >= 4500 && counter <= 7100)) { //verse counter
      drawWave(amplitude, frequency, counter, yOffset, phase);
    }
  }
  pop();

  if ((counter >= 2755 && counter <= 4500) || (counter >= 7100 && counter <= 8000)) { //chorus counter
    drawEllipse(width, height, bassSize, drumSize, counter);
  }

  if ((counter > 1 && counter <= 2700) || (counter >= 4500 && counter <= 7100) || (counter >= 8000 && counter <= 9841)) { //verse counter
    drawWords(words, wordSize, changingColor, width, height, vocal, bassSize, counter);
  }
}
//draws sine wave
function drawWave(amplitude, frequency, counter, yOffset, phase) {
  stroke(255);
  noFill();
  beginShape();
  for (var i = 0; i < width; i++) {
    let x = i;
    let y = height / 5 + yOffset + amplitude * sin(frequency * x + (counter * 0.05) + phase);
    vertex(x, y);
  }
  endShape();
  noStroke();
}
//draws words and changes color
function drawWords(words, wordSize, changingColor, width, height, vocal, counter) {
  textAlign(CENTER, CENTER);
  fill(changingColor);
  textSize(wordSize);

  let baseX = width / 2;
  let baseY = height / 3.8;

  let spacing = wordSize * 0.6;
  let startX = baseX - (words.length - 1) * spacing / 2;

  for (let i = 0; i < words.length; i++) {
    let charX = startX + i * spacing + 10 * sin(counter * 0.05 + i * 0.3);
    let charY = baseY + 25 * sin(counter * 0.05 + i * 0.05 + vocal * 0.02)
    text(words[i], charX, charY);
  }
}
//draws ellipse and changes color using chorusColor function
function drawEllipse(width, height, bassSize, drumSize, counter) {
  let rows = 5;
  let cols = 5;
  let xSpace = width / (cols + 0.9);
  let ySpace = height / (rows + 1);

  //creates offset grid structure for ellipses
  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
      let x = xSpace * col;
      let y = ySpace * row;

      if ((row + col) % 2 == 0) {
        let c1 = chorusColor(counter, row + col);
        let c2 = chorusColor(counter, row * col);
        fill(c1);
        ellipse(x, y, bassSize / 2, drumSize / 2);
        fill(c2);
        ellipse(x, y, drumSize / 2, bassSize / 2);

      }
    }
  }
}
//Draws bar spectrum, and changes color depending on location within song
function drawSpectrum(drum, bass, vocal, other, width, height, counter) {
  colorMode(RGB);
  let numBars = 60;
  let barWidth = width / numBars;

  if (barHeights.length != numBars) {
    barHeights = new Array(numBars).fill(0);
    initialiseBarColors(numBars);
  }

  //initialises bar heights
  for (let i = 0; i < numBars; i++) {
    let t = i / numBars;
    let value = (
      drum * (1 - t) * 0.8 +
      bass * sin(t * PI) +
      vocal * t * 0.5 +
      other * noise(t * 5, counter * 0.01));

    let targetH = map(value, 0, 100, 0, height * 0.7);
    barHeights[i] = lerp(barHeights[i], targetH, 0.2)
  }
  noStroke();
  //draws and colors bars depending on location
  for (let i = 0; i < numBars; i++) {
    let h = barHeights[i];
    if ((counter >= 2755 && counter <= 4500) || (counter >= 7100 && counter <= 8000)) { //chorus counter
      fill(chorusColor(counter, i));
    } else {
      fill(barColors[i]);
    }
    rect(i * barWidth, height - h, barWidth - 2, h)
  }
}