//Kevin Blair
//6/7/18
//Final Project
$(document).ready(function(){
	$('#button').click(function(){
		$('#myCanvas').focus();
		var canvas = document.getElementById('myCanvas');
		var ctx = canvas.getContext("2d");
		var w = $("#myCanvas").width();
		var h = $("#myCanvas").height();

		var cw = 20;
		var dir; 
		var snake;
		var food;
		var score;
		var highscore = 0;



		function setup(){
			dir = 'right'; //initial direction
			//creating the snake
			createSnake();
			createFood(); //calling the function to create the food for the snake
			score = 0;

			if(typeof game_loop != 'undefined') clearInterval(game_loop);
			//calling snakeGame on a continuous loop, waiting 120ms every call
			game_loop = setInterval(snakeGame, 100);
		}
		setup();


		function createSnake(){
			var length=1; //starting length of the snake
			snake = []; //starting with an empty array
			for(let i = length-1; i >= 0; i--){
				snake.push({x:i, y:0});
			}
		}

		//creating food in a random x, y location of the canvas
		function createFood(){
			food = {x: Math.floor((Math.random()*(w-cw))/cw),
					y: Math.floor((Math.random()*(h-cw))/cw)
			}
		}


		function snakeGame(){
			//clearing the canvas every iteration through snakeGame
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, w, h);
			ctx.strokeStyle = "white";
			ctx.strokeRect(0, 0, w, h);

			//gettin the tail x and y for the snake
			var nx = snake[0].x;
			var ny = snake[0].y;

			//changing the direction of the snake based upon keyboard inputs
			if(dir == "right") nx++;
			else if(dir == "left") nx--;
			else if(dir == "up") ny--;
			else if(dir == "down") ny++;

			//the check to see if the snake either went out of the canvas area, or hit itself
			if(nx == -1||nx == w/cw||ny == -1||ny == h/cw||death(nx, ny, snake)){
				//checking to see if the new score is greater than the older highscore
				if(highscore<score){
					//if it is, then change the highscore to the new score
					highscore = score;
					//and display it
					$('#score').text('Highscore: '+highscore);
				}
				//restart game on death
				setup();
				return;
			}

			//if the snake ate the food, then dont put the tail end of the snake to the front, instead just add to the tail
			if(nx == food.x && ny == food.y){
				var tail = {x:nx, y:ny};
				score++;
				createFood();
			}else{
				//if the snake doesnt eat the food, then pop the tail off to use later
				var tail = snake.pop();
				tail.x = nx;
				tail.y = ny;
			}
			//put the tail infront of the snake for the movement of the snake
			snake.unshift(tail);

			for(let i = 0; i<snake.length; i++){
				var s = snake[i];
				snakeCells(s.x, s.y);
			}
			foodCells(food.x, food.y);
			//to display the user's current score
			var scoreText = 'Score: ' + score;
			ctx.font='25px Georgia';
			ctx.fillText(scoreText, 5, h-5);
		}
		//this function is used to draw the snake
		function snakeCells(x, y){
				ctx.fillStyle = 'green';
				ctx.fillRect(x*cw, y*cw, cw, cw);
				ctx.strokeStyle = 'black';
				ctx.strokeRect(x*cw, y*cw, cw, cw);
		}
		//this function is used to draw the food
		function foodCells(x, y){
				ctx.fillStyle = 'red';
				ctx.fillRect(x*cw, y*cw, cw, cw);
				ctx.strokeStyle = 'black';
				ctx.strokeRect(x*cw, y*cw, cw, cw);
		}


		function death(x, y, array){
			for(let i = 0; i<array.length; i++){
				//checks to see if the snake has hit itself causing the game to reset
				if(array[i].x == x && array[i].y == y){
					return true;
				}
			}
			return false;
		}

		$(document).keydown(function(e){
			var key = e.which;
			//allowing keyboard controls
			//adding a clause to prevent the snake from going backwards
			//these are the keycodes for WASD, im going to leave them in in case anyone wants to use them
			//but the primary way of movement is using arrow keys
			/*if(key == '87' && dir !='down') dir = 'up';
			else if(key == '83' && dir !='up') dir = 'down';
			else if(key == '68' && dir !='left') dir = 'right';
			else if(key == '65' && dir !='right') dir = 'left';*/
			if(key == "37" && dir != "right") dir = "left";
			else if(key == "38" && dir != "down") dir = "up";
			else if(key == "39" && dir != "left") dir = "right";
			else if(key == "40" && dir != "up") dir = "down";

		});
	});
});

/*
1. I tried using up arrow, down arrow, left arrow, right arrow to move snake. Result confirmed
2. I tried killing the snake by having it hit itself. Result confirmer
3. I tried killing the snake by having it go outside the canvas. Result confirmed
4. I tried to go left when the snake was going right but couldnt because of the prevention of the snake going backwards. Result confirmed
5. I noticed that if i hit an arrow the hit the opposite arrow the snake would go backwards and kill itself.
Meaning if i was going right then quickly hit up arrow then left, the snake would start moving left in the same row it was in and run into itself
6. I tried eating the food making sure the snake would increase its length by one unit. Result confirmed
*/