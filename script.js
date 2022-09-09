//Thanks to Bulbapedia for the high quality images: http://bulbapedia.bulbagarden.net/wiki/Main_Page
//Random Whole Number
function randomPokemon(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function fallDown(id){
  if(Number(getComputedStyle(document.getElementById(id)).top.replace('px',''))<0){
    document.getElementById(id).style.top = (Number(getComputedStyle(document.getElementById(id)).top.replace('px','')) + (window.innerHeight/5)) + 'px';
    setTimeout(function(){
      return fallDown(id);
    }, 40);
  }
}
window.onload = function(){
  var pokemon = [], canvas = document.getElementById('image'), ctx = canvas.getContext('2d'), currPokemon, randId, correct = 0;
  // canvas.width = window.innerWidth/2 + window.innerWidth/4;
  // canvas.height = window.innerHeight;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.mlab.com/api/1/databases/pokemon-db/collections/pokemon?apiKey=nu_KiGtqpF7sBVKU7JEl1xF8m9rqKtc7');
  xhr.send(null);
    xhr.onreadystatechange = function () {
      var DONE = 4; // readyState 4 means the request is done.
      var OK = 200; // status 200 is a successful return.
      if (xhr.readyState === DONE) {
        if (xhr.status === OK){
          
          pokemon = JSON.parse(xhr.responseText)[0].pokemon;
          for(var i=1; i<pokemon.length; i++){
            pokemon[i].id = i+1;
            pokemon[i].img = 'https://s3.amazonaws.com/pokemon-db/icons/'+(i+1)+'.png';
    
          }
          document.getElementById('new').click();
        }
      }
    }  
    document.getElementById('new').addEventListener('click', function(e){
    e.preventDefault();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    randId = randomPokemon(1, 150);
    var randPokemon = pokemon[randId];
    var img = new Image();
    img.src = randPokemon.img;
    currPokemon = randPokemon.name;
    img.crossOrigin = "Anonymous";
    img.onload = function(){
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      //Modified from: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
      var pixel = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = pixel.data;
      var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
      var data = imageData.data;
      for(var i = 0; i<data.length; i+=4){
        if(data[i]!==0 && data[i+1]!==0 && data[i+2]!==0 && data[i+3]!==0){
          data[i]     = 8;     // red
          data[i + 1] = 91; // green
          data[i + 2] = 136; // blue
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
  });
 // document.getElementById('new').click();
  document.getElementById('guessBtn').addEventListener('click', function(){
    var guess = document.getElementById('guess').value;
    if(guess.toLowerCase() !== currPokemon){
      if(document.getElementById('countdown').innerHTML == 0){
       fallDown('game-over');
        
      } else {
        document.getElementById('countdown').innerHTML = Number(document.getElementById('countdown').innerHTML)-1;
      }
    } else {
      correct += 1;
      var img = new Image();
      img.src = pokemon[randId].img;
      currPokemon = pokemon[randId].name;
      img.crossOrigin = "Anonymous";
      img.onload = function(){
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      document.getElementById('correct').innerHTML = correct;
      document.getElementById('guess').value = '';
    }
  });
  
}