
function draw_one_frame(words, vocal, drum, bass, other, counter) {
    background(20)
    drumSize = map(drum, 0, 100, 50, 400);  
    bassSize = map(bass, 0, 100, 50, 400);  
    wordSize = map(vocal,0, 700, 60, 600)


    fill(255, 100, 50)
   ellipse(width/2, height/2, bassSize, drumSize);

    fill(100, 100, 50);
   ellipse(width/2, height/2, drumSize, bassSize);
    fill(167, 120, 30);

   ellipse(width/2, drumSize, 100, 100)
   


   textAlign(CENTER);
   textSize(vocal);
   fill(wordSize, drumSize/2, bassSize/2);
   text(words, wordSize+width/3, height/4);




}
   



