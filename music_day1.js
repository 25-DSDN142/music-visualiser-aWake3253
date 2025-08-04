let sunY = 200

function draw_one_frame(words, vocal, drum, bass, other, counter) {
    background(20)
    drumSize = map(drum, 0, 100, 50, 400);  
    bassSize = map(bass, 0, 100, 50, 400);  

    sunY += (bass-50) *0.2;
    fill(255, 100, 50)
   ellipse(width/2, height/2, bassSize, drumSize);

    fill(100, 100, 50);
   ellipse(width/2, height/2, drumSize, bassSize);
   
   if (sunY > 1000) {
    sunY = 0}

textAlign(CENTER);
   textSize(vocal);
   text(words, width/2, height/4);





}
   



