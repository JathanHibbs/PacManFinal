
$(function() {
	var ctx = $('#canvas').get(0).getContext("2d");
	var timerMod = 0;	//modifier for "Speed Rounds" mode
	var healthMod = 1;	//modifier for "Double Health" mode
	var screenHeight = 540;
	var screenWidth = 700;
	var timerInt, gameLoop, fps, timer;	//Establish variables for interval functions
	
	/*
		Players one and two are handled as variables rather than instancing a player class.
		This is to allow for the differences in their draw functions, where projectile collisions are handled.
	*/
	var playerOne = {
		color: "red",
		x: 91,
		y: 175,
		rot: 0,
		sect: 2,
		hp: 100 * healthMod,
		power: 50,
		aim: (-Math.PI / 2),
		active: true,
		draw: function() {
			ctx.save();
			ctx.fillStyle = this.color;
			ctx.strokeStyle = this.color;
			ctx.font="32px Arial";
			ctx.fillText("Health : " + this.hp, 30, 500);
			ctx.font="24px Arial";
			ctx.fillText("Power :", 30, 527);
			ctx.fillRect(120, 510, (this.power/100)*80, 20);
			ctx.strokeRect(120, 510, 80, 20);
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.arc(this.x, this.y, 15, 0 + this.rot, Math.PI + this.rot, true);
			ctx.fill();
			if(projectile.active && !this.active) {
				if(ctx.isPointInPath(projectile.x, projectile.y)) {
					projectile.hit = true;
				}
			}
			ctx.translate(this.x, this.y);
			ctx.moveTo(0, -5);
			ctx.rotate(this.aim + this.rot - Math.PI/2);
			ctx.lineTo(0, 30);
			ctx.stroke();
			ctx.restore();
		}
	}
	
	var playerTwo = {
		color: "blue",
		x: 609,
		y: 175,
		rot: 0,
		sect: 8,
		hp: 100 * healthMod,
		power: 50,
		aim: (-Math.PI / 2),
		active: false,
		draw: function() {
			ctx.save();
			ctx.fillStyle = this.color;
			ctx.strokeStyle = this.color;
			ctx.font="32px Arial";
			ctx.fillText("Health : " + this.hp, 500, 500);
			ctx.font="24px Arial";
			ctx.fillText("Power :", 500, 527);
			ctx.fillRect(590, 510, (this.power/100)*80, 20);
			ctx.strokeRect(590, 510, 80, 20);
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.arc(this.x, this.y, 15, 0 + this.rot, Math.PI + this.rot, true);
			ctx.fill();
			if(projectile.active && !this.active) {
				if(ctx.isPointInPath(projectile.x, projectile.y)) {
					projectile.hit = true;
				}
			}
			ctx.translate(this.x, this.y);
			ctx.moveTo(0, -5);
			ctx.rotate(this.aim + this.rot - Math.PI/2);
			ctx.lineTo(0, 30);
			ctx.stroke();
			ctx.restore();
		}
	}
	
	// Projectile variable handles projectile motion and collisions with the map
	var projectile = {
		x: 0,
		y: 0,
		rot: 0,
		power: 0,
		velX: 0,
		velY: 0,
		hit: false,
		active: false,
		// Initalizes a projectile from the active player
		fire: function() {
			if(!this.active) {
				this.active = true;
				if(playerOne.active) {
					this.x = playerOne.x - 2;
					this.y = playerOne.y - 2;
					this.rot = playerOne.aim + playerOne.rot;
					this.power = (playerOne.power/100)*8 + 7;
				}
				else if(playerTwo.active) {
					this.x = playerTwo.x - 2;
					this.y = playerTwo.y - 2;
					this.rot = playerTwo.aim + playerTwo.rot;
					this.power = (playerTwo.power/100)*8 + 7;
				}
				
				this.velX = this.power*Math.sin(this.rot + Math.PI/2);
				this.velY = this.power*Math.cos(this.rot - Math.PI/2);
			}
		},
		// Draws the projectile and handles damage if a hit was detected. Also contains end game handling (triggered by 0 health)
		draw: function() {
			if(this.active) {
				ctx.save();
				ctx.fillStyle = "white";
				ctx.translate(this.x, this.y);
				ctx.fillRect(-2, -2, 4, 4);
				ctx.restore();
				
				this.x += this.velX;
				this.y += this.velY;
				
				this.velY += 0.4; // simulates gravity on projectile
				
				if(ctx.isPointInPath(this.x, this.y) || this.x < 0 || this.x > 700) {
					this.active = false;
					
					// secondary hit testing for som situations where collision was not detected in player draw functions
					if(playerOne.active && playerTwo.x > (this.x - 13) && playerTwo.x < (this.x + 13)) this.hit = true;
					if(playerTwo.active && playerOne.x > (this.x - 13) && playerOne.x < (this.x + 13)) this.hit = true;
					
					if(this.hit && playerOne.active) playerTwo.hp -= 25;
					if(this.hit && playerTwo.active) playerOne.hp -= 25;
					if((playerOne.hp <= 0) || (playerTwo.hp <= 0)) {
						if(playerOne.hp <= 0) {
							alert("Player 2 wins!");
						}
						else {
							alert("Player 1 wins!");
						}
						clearInterval(gameLoop);
						clearInterval(timerInt);
						startGame();
					}
					
					playerOne.active = !playerOne.active;
					playerTwo.active = !playerTwo.active;
					timer = 9;
					this.hit = false;
				}
			}
		}
	}
	
	// Verifies that two different colors are selected, then sets any game mode modifiers that were selected
	$('#startButton').click(function() {
		var colors = ["red", "blue", "teal", "yellow", "gray", "orange", "purple", "pink"];
		var colorOne = $('input[name=colorOne]:checked').val();
		var colorTwo = $('input[name=colorTwo]:checked').val();
		if(document.getElementById('doubleHealth').checked) healthMod = 2;
		if(document.getElementById('speedRound').checked) timerMod = 3;
		if(colorOne == colorTwo) {
			alert("Please select two different colors");
		}
		else {
			playerOne.color = colors[colorOne];
			playerTwo.color = colors[colorTwo];
			startGame();
		}
	});
	
	// Initalizes game variables and interval functions; also used to restart game
	function startGame() {
		$('#canvas').show();
		$('#startButton').hide();
		$('#startForm').hide();
		
		fps = 30;	//used to adjust game loop rate for performance
		gameLoop = setInterval(function() {
			update();
			draw();
		}, 1000/fps);
		
		timer = 9 - timerMod;
		timerInt = setInterval(function() {
			if(timer > 0 && !projectile.active) {
				timer -= 1;
			} 
			else if(timer <= 0 && !projectile.active) {
				timer = 9 - timerMod;
				playerOne.active = !playerOne.active;
				playerTwo.active = !playerTwo.active;
			}
		}, 1000);
		
		playerOne.x = 100;
		playerTwo.x = 600;
		playerOne.y = 175;
		playerTwo.y = 175;
		playerOne.power = 50;
		playerTwo.power = 50;
		playerOne.aim = (-Math.PI / 2);
		playerTwo.aim = (-Math.PI / 2);
		playerOne.hp = 100 * healthMod;
		playerTwo.hp = 100 * healthMod;
		
		boundsCheck(playerOne);
		boundsCheck(playerTwo);
	}

	// clears and runs draw functions to populate the screen each frame
	function draw() {
		ctx.clearRect(0, 0, screenWidth, screenHeight);
		ctx.fillStyle = "green";
		drawPvPMap();
		projectile.draw();
		playerOne.draw();
		playerTwo.draw();
		drawTimer();
	}
	
	// coordinates for drawing the map for "player versus player"
	var mapPvP = {
		x: [30, 90, 160, 300, 325, 375, 400, 540, 610, 670],
		y: [400, 375, 400, 330, 370, 370, 330, 400, 375, 400]
	}
	
	// draws map based on mapPvP
	function drawPvPMap() {
		ctx.beginPath();
		ctx.moveTo(0, screenHeight);
		ctx.lineTo(0, 50);
		ctx.lineTo(mapPvP.x[0], mapPvP.y[0]);
		ctx.lineTo(mapPvP.x[1], mapPvP.y[1]);
		ctx.lineTo(mapPvP.x[2], mapPvP.y[2]);
		ctx.lineTo(mapPvP.x[3], mapPvP.y[3]);
		ctx.lineTo(mapPvP.x[4], mapPvP.y[4]);
		ctx.lineTo(mapPvP.x[5], mapPvP.y[5]);
		ctx.lineTo(mapPvP.x[6], mapPvP.y[6]);
		ctx.lineTo(mapPvP.x[7], mapPvP.y[7]);
		ctx.lineTo(mapPvP.x[8], mapPvP.y[8]);
		ctx.lineTo(mapPvP.x[9], mapPvP.y[9]);
		ctx.lineTo(screenWidth, 50);
		ctx.lineTo(screenWidth, screenHeight);
		ctx.fill();
	}

	// ensures players are on the path of the map through boundsCheck()
	function update() {
		drawPvPMap();
		if(playerOne.active) boundsCheck(playerOne);
		if(playerTwo.active) boundsCheck(playerTwo);
	}
	
	// breaks the map up into sections with precalculated slopes and rotational values for the tanks
	function boundsCheck(player) {
		var sect = 0;
		for(var i = 1; i < 10; i++) {
			if(player.x <= mapPvP.x[i]) {
				sect = i;
				break;
			}
		}
		switch(sect) {
			case 1:
				player.y = mapPvP.y[0] - ((player.x - mapPvP.x[0]) * 0.417);
				player.rot = -0.39;
				break;
			case 2:
				player.y = mapPvP.y[1] + ((player.x - mapPvP.x[1]) * 0.357);
				player.rot = 0.34;
				break;
			case 3:
				player.y = mapPvP.y[2] - ((player.x - mapPvP.x[2]) * 0.5);
				player.rot = -0.46;
				break;
			case 4:
				player.y = mapPvP.y[3] + ((player.x - mapPvP.x[3]) * 1.6);
				player.rot = 1.01;
				break;
			case 5:
				player.y = mapPvP.y[4];
				player.rot = 0;
				break;
			case 6:
				player.y = mapPvP.y[5] - ((player.x - mapPvP.x[5]) * 1.6);
				player.rot = -1.01;
				break;
			case 7:
				player.y = mapPvP.y[6] + ((player.x - mapPvP.x[6]) * 0.5);
				player.rot = 0.46;
				break;
			case 8:
				player.y = mapPvP.y[7] - ((player.x - mapPvP.x[7]) * 0.357);
				player.rot = -0.34;
				break;
			case 9:
				player.y = mapPvP.y[8] + ((player.x - mapPvP.x[8]) * 0.417);
				player.rot = 0.39;
				break;
			default:
				alert("out of bounds error");
				break;
		}
		player.sect = this.sect;
	}
	
	// displays the time remaining in a turn
	function drawTimer() {
		ctx.save();
		if(playerOne.active) ctx.fillStyle = playerOne.color;
		if(playerTwo.active) ctx.fillStyle = playerTwo.color;
		ctx.font="32px Arial";
		ctx.fillText("Time Left", 285, 480);
		ctx.fillText(timer, 345, 520);
		ctx.restore();
	}
	
	// functions for handling key press events
	$(document).keydown(function(key) {
		var i = parseInt(key.which);
		switch(i) {
			case 90:	// move left (z key)
				if(playerOne.active && playerOne.x > 45 && !projectile.active) playerOne.x -= 0.5;
				if(playerTwo.active && playerTwo.x > 45 && !projectile.active) playerTwo.x -= 0.5;
				break;
			case 88:	// move right (x key)
				if(playerOne.active && playerOne.x < 655 && !projectile.active) playerOne.x += 0.5;
				if(playerTwo.active && playerTwo.x < 655 && !projectile.active) playerTwo.x += 0.5;
				break;
			case 37:	// aim left (left arrow)
				if(playerOne.active && playerOne.aim > -Math.PI + 0.05 && !projectile.active) playerOne.aim -= 0.05;
				if(playerTwo.active && playerTwo.aim > -Math.PI + 0.05 && !projectile.active) playerTwo.aim -= 0.05;
				break;
			case 39:	// aim right (right arrow)
				if(playerOne.active && playerOne.aim < -0.05 && !projectile.active) playerOne.aim += 0.05;
				if(playerTwo.active && playerTwo.aim < -0.05 && !projectile.active) playerTwo.aim += 0.05;
				break;
			case 38:	// raise power (up arrow)
				if(playerOne.active && playerOne.power < 100 && !projectile.active) playerOne.power += 1;
				if(playerTwo.active && playerTwo.power < 100 && !projectile.active) playerTwo.power += 1;
				break;
			case 40:	// lower power (down arrow)
				if(playerOne.active && playerOne.power > 1 && !projectile.active) playerOne.power -= 1;
				if(playerTwo.active && playerTwo.power > 1 && !projectile.active) playerTwo.power -= 1;
				break;
			case 32:	// fire projectile (space bar)
				projectile.fire();
				break;
			default:
				
		}
	});
});