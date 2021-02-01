//Final Project William and Victoria
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var gameStarted = false;
var keys = [];
var friction = 0.8;
var gravity = 0.45;
var lobbyMusic, gameMusic, birdWarning, gameOver;
var completed = false;
var scoreValue = 0;

var player_image = new Image();
player_image.src = "pineapple.png";

var bird_image = new Image();
bird_image.src = "bird.gif";

var player = {
	x: 350,
	y: canvas.height - 40,
	width: 50,
	height: 55,
	speed: 5,
	velX: 0,
	velY: 0,
  jumping: false,
	jumpStrength: 5,
	draw: function(){
		context.drawImage(player_image, this.x, this.y, this.width, this.height);
	}
}

var bird = {
	x: canvas.width-150,
	y: 150,
	width:55,
	height:55,
	speedX: 1,
	draw: function(){
		context.drawImage(bird_image, this.x, this.y, this.width, this.height);

		//Makes the bird go back and forth on the screen
		if (this.x < 0 || this.x + this.width > canvas.width) {
			this.speedX *= -1;
		}
		this.x += this.speedX;

		//Randomly generated position after bird hits the bottom of the screen
		if(this.y > canvas.height){
			this.y = Math.floor(195 * Math.random() - 250);
			this.x = Math.floor(345 * Math.random() + 0);
		}
		this.y++;

		//Warning sound to the player that the bird is coming
		if (this.y > -55 && this.y < 0) {
			birdWarning.play();
		}
	}
}

//Platforms begin with set position, then get randomly regenerated after they hit the bottom of the screen
var platforms = [];
var platform_width = 100;
var platform_height = 10;

//.push adds an object to the end of an array
platforms.push({
	x: canvas.width-350,
	y: canvas.height,
	width: platform_width,
	height: platform_height,
});

platforms.push({
    x: canvas.width-170,
    y: 500,
    width: platform_width,
    height: platform_height,
});

platforms.push({
    x: canvas.width-325,
    y: 390,
    width: platform_width,
    height: platform_height,
});
platforms.push({
    x: canvas.width-200,
    y: 280,
    width: platform_width,
    height: platform_height,
});
platforms.push({
    x: canvas.width-390,
    y: 190,
    width: platform_width,
    height: platform_height,
});
platforms.push({
    x: canvas.width-190,
    y: 80,
    width: platform_width,
    height: platform_height,
});


function draw_platforms(){
	context.fillStyle = "#907020";

	for(var i = 0; i < platforms.length; i++){
		context.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
		context.lineWidth = 5;
		context.strokeStyle = "#90D030";
		context.strokeRect(platforms[i].x, platforms[i].y-2, platforms[i].width, 5);
		platforms[i].y++;
		//After platforms hit bottom, they get randomly regenerated
		if(platforms[i].y > canvas.height){
			platforms[i].y = Math.floor(20 * Math.random() - 20);
			platforms[i].x = Math.floor(240 * Math.random() + 20);
		}
	}
}

//Keyboard controls
document.body.addEventListener("keydown", function(event){
	if(event.keyCode == 13 && !gameStarted){
		startGame();
	}
	if(event.keyCode == 13 && completed == true){
		reset();
	}
	keys[event.keyCode] = true;
});

document.body.addEventListener("keyup", function(event){
	keys[event.keyCode] = false;
});

//Collision check using half widths was taken from https://devdojo.com/course/html5-platform-game/introduction
function collisionCheck(character, platform){

	//Distance from player x to platform x (middle to middle)
	var vectorX = (character.x + (character.width/2)) - (platform.x + (platform.width/2));
	var vectorY = (character.y + (character.height/2)) - (platform.y + (platform.height/2));

	var halfWidths = (character.width/2) + (platform.width/2);
	var halfHeights = (character.height/2) + (platform.height/2);

  var collisionDirection = null;

  if(Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights){

		//Distance from platform
    var offsetX = halfWidths - Math.abs(vectorX);
    var offsetY = halfHeights - Math.abs(vectorY);

    if (offsetX < offsetY){
      if (vectorX > 0){
          collisionDirection = "left";
      } else {
          collisionDirection = "right";
      }
    }
		else {
      if (vectorY > 0){
          collisionDirection = "top";
      }
			else {
          collisionDirection = "bottom";
					//Only bounces off platform when character comes from above
					if (character.velY > 0) {
          character.y -= offsetY;
					}
      }
    }
  }
  return collisionDirection;
}

function clearCanvas(){
	context.clearRect(0, 0, 400, 600);
}

//Function that controls all the sound in the game
function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	this.sound.loop = true;
	document.body.appendChild(this.sound);
	this.play = function() {
		this.sound.play();
	}
	this.stop = function() {
		this.sound.pause();
	}
	if (src == "birdincoming.mp3" || src == "gameover.mp3") {
		this.sound.loop = false;
		this.sound.volume = 0.9;
	}
}

var score = {
	x: 65,
	y: 40,
	font: '25px Nanum Brush Script',
	color: "black",
	draw : function() {
		context.fillStyle = this.color;
		context.font = this.font;
		context.fillText(this.text, this.x, this.y);
	}
}

intro_screen();

function intro_screen(){
	lobbyMusic = new sound("lobbymusic.mp3");
	lobbyMusic.play();
	context.font = "45px Nanum Brush Script";
	context.fillStyle = "#0099CC";
	context.textAlign = "center";
	context.fillText("TROPICAL TREASURE", canvas.width/2, canvas.height - 370);

	context.font = "25px Nanum Brush Script";
	context.fillText("Press Enter To Start", canvas.width/2, canvas.height - 330);
}

 var startGame = function(){
	 lobbyMusic.stop();
	 gameMusic = new sound("backgroundmusic.mp3");
	 gameMusic.play();
	 birdWarning = new sound("birdincoming.mp3");
	 gameOver = new sound("gameover.mp3");

	 gameStarted = true;
	 clearCanvas();

	this.interval = setInterval(function(){
		clearCanvas();
		loop();
	}, 18)
}

function loop(){
	//Score goes up 0.1 every time the game area is updated
	scoreValue += 0.1;
	score.text = "SCORE: " + Math.floor(scoreValue);

	draw_platforms();
	bird.draw();
	player.draw();
	score.draw();

	if(keys[39]){
		if(player.velX < player.speed){
			player.velX++;
		}
	}
	if(keys[37]){
		if(player.velX > -player.speed){
			player.velX--;
		}
	}
  if(!player.jumping){
			player.velY = -player.jumpStrength*2;
			player.jumping = true;
	}

	player.x += player.velX;
  player.y += player.velY;

	player.velX *= friction;
  player.velY += gravity;

	//Allows player to go through the bottom of the platform, but not the top
  for(var i = 0; i < platforms.length; i++){
  		var direction = collisionCheck(player, platforms[i]);

			if(direction == "bottom" && player.velY > 0) {
				player.velY *= -1;
				player.jumping = false;
			}
  }

	//If player goes off the sides of the screen
  if (player.x + player.width < 0) {
    player.x = canvas.width;
  } else if (player.x - player.width > canvas.width) {
    player.x = 0;
  }

	//When player hits bird or player falls off bottom of the screen
	if(collisionCheck(player, bird) || player.y - player.height > canvas.height){
		complete();
	}
}

//End screen
function complete(){
	gameMusic.stop();
	gameOver.play();
	clearCanvas();
	clearInterval(this.interval);
	completed = true;

	context.font = "55px Nanum Brush Script";
	context.fillStyle = "#0099CC";
	context.textAlign = "center";
	context.fillText("GAME OVER", canvas.width/2, canvas.height - 370);

	context.font = "25px Nanum Brush Script";
	context.fillText("Press Enter to Play Again", canvas.width/2, canvas.height - 330);

	context.font = "30px Nanum Brush Script";
	context.fillStyle = "black";
	context.fillText("YOUR SCORE: " + Math.floor(scoreValue), canvas.width/2, canvas.height - 250);

}
function reset(){
	location.reload();
}
