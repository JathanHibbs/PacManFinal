/**
 * By: Jathan Hibbs
 * Pac-Man Project
 * CSD 122
 * player.js
 * contains functions that creates the player, updates the player, controls movement of the player, and the death of the player
 */

//global player variable
var player;
//the pixel size of each element in the grid
const gridPixelSize = 32;
//the rate of speed that the player moves at
var moveSpeed = 2.5;
//the score
var score = 0;
//save the directional values so that i dont have to memorize them
const directions = { stop: 0, up: 1, right: 2, down: 3, left: 4 };

/**
 * Creates the player object, dom object, sets the screen position, and sets up the update functions to be continually called
 */
function setupPlayer()
{
    //position of the container
    let boxPosition = $("section").position();
    //player object initialization
    player = { gridX: 7, gridY: 15, direction: directions.left, nextDirection: directions.stop, lastDirection: directions.left };
    //DOM object
    player.$player = $('<img src="assets/pacmanPlayer.gif"/>').appendTo("section");
    //sets z index so that the player is on top of the pellets
    player.$player.css("z-index", 1);
    //sets inital player position
    player.$player.offset({ top: ((player.gridY * gridPixelSize) + boxPosition.top), left: ((player.gridX * gridPixelSize) + boxPosition.left) });
    //creates canChangeDirection object, prevents glitching through walls
    player.canChangeDirection = { canIt: true, X: 0, Y: 0 };

    //call changeDirection function every time a key is pressed. e is the event variable
    $(document).keydown(function (e) {
        changeDirection(e);
    });

   //updates player position every 30 miliseconds. updateInterval variable so I can stop the game on death
   player.updateInterval = setInterval(updatePlayer, 30);
}

/**
 * changes the next direction of pacman based off of key input
 * @param {any} event event variable contains which key was pressed
 */
function changeDirection(event)
{
    //event.which contains the keycode of the key that was pressed
    switch (event.which)
    {
        case 87: //W
        case 38: //up arrow
            player.nextDirection = directions.up;
            break;
        case 68: //D
        case 39: //Right arrow
            player.nextDirection = directions.right;
            break;
        case 83: // S
        case 40: //Down arrow
            player.nextDirection = directions.down;
            break;
        case 65: //A
        case 37: //Left Arrow
            player.nextDirection = directions.left;
            break;
    }
    //console.log(player.nextDirection);
}

/**
 * updates the player pos and direction
 */
function updatePlayer()
{
    //position of container
    let boxPosition = $("section").position();

    //the position to check depending on the direction the player is going
    let playerCheckX = player.$player.position().left;
    let playerCheckY = player.$player.position().top;

    //changes the value to be checked depending on the direction
    if (player.direction == directions.up) {
        playerCheckY += gridPixelSize/2;
    }
    else if (player.direction == directions.right) {
        playerCheckX -= gridPixelSize / 2;
    }
    else if (player.direction == directions.down) {
        playerCheckY -= gridPixelSize / 2;
    }
    else if (player.direction == directions.left) {
        playerCheckX += gridPixelSize/2;
    }

    //sets the grid position depending on the player pos
    player.gridX = Math.round((playerCheckX - boxPosition.left) / gridPixelSize);
    player.gridY = Math.round((playerCheckY - boxPosition.top) / gridPixelSize);
    //console.log(player.gridX + ", " + player.gridY);

    //so the player cant change direction multiple times in one square, when in new square the ability to change directions is enables again.
    if (player.gridX != player.canChangeDirection.X || player.gridY != player.canChangeDirection.Y)
        player.canChangeDirection.canIt = true;

    //if the direction the player wants to go in is valid, and the player hasnt already changed directions on this tile
    if (isNextTileValid(player.nextDirection, player) && player.canChangeDirection.canIt)
    {
        //set the last direction moved
        player.lastDirection = player.direction;
        //sets new directin
        player.direction = player.nextDirection;
        //next direction reset
        player.nextDirection = directions.stop;

        //sets the tile that the player has changed directions in, so the player doesnt change again
        player.canChangeDirection.X = player.gridX;
        player.canChangeDirection.Y = player.gridY;
        player.canChangeDirection.canIt = false;
    }

    //console.log(player.direction);

    //if the player is about to hit a wall, stop the player
    if(!isNextTileValid(player.direction, player))
        player.direction = directions.stop;    

    //update movement
    if (player.direction == directions.up)
    {
        //change player position
        player.$player.offset({ top: player.$player.position().top - moveSpeed });
        //change rotation of pacman
        player.$player.css({ 'transform': 'rotate(-90deg)' });
    }
    else if (player.direction == directions.right)
    {
        player.$player.offset({ left: player.$player.position().left + moveSpeed });
        player.$player.css({ 'transform': 'rotate(0deg)' });
    }
    else if (player.direction == directions.down)
    {
        player.$player.offset({ top: player.$player.position().top + moveSpeed });
        player.$player.css({ 'transform': 'rotate(90deg)' });
    }
    else if (player.direction == directions.left)
    {
        player.$player.offset({ left: player.$player.position().left - moveSpeed });
        player.$player.css({ 'transform': 'rotate(180deg)' });
    }

    //teleport tunnel code
    //if the player is outside the visible box (hardcoded tile) 
    if(player.gridX == 15 && player.gridY == 9)
    {
        //only teleports if the player is facing the right direction, so that the player doesnt end up in an endless loop of teleporting
        if(player.direction != directions.left)
        {
            //change player pos
            player.$player.offset({ top: ((9 * gridPixelSize) + boxPosition.top), left: ((-1.1 * gridPixelSize) + boxPosition.left) });
            //change next direction to fix glitch where player can exit the map
            player.nextDirection = directions.right;
        }
    }
    if(player.gridX == -1 && player.gridY == 9)//pretty much the same thing
    {
        if(player.direction != directions.right)
        {
            player.$player.offset({ top: ((9 * gridPixelSize) + boxPosition.top), left: ((15 * gridPixelSize) + boxPosition.left) });
            player.nextDirection = directions.left;
        }
    }

    //update score
    $("#scoreBoard").text("Score: " + score);
}

/**
 * on player death
 */
function playerDeath()
{
    console.log("you died");
    //reset timers that update all the enemies and player
    clearInterval(blinky.updateInterval);
    clearInterval(pinky.updateInterval);
    clearInterval(inky.updateInterval);
    clearInterval(clyde.updateInterval);
    clearInterval(player.updateInterval);
    //show gameover sprite
    var $gameOver = $('<img src="assets/gameOver.png"/>').appendTo("section");

    //position of container
    let boxPosition = $("section").position();
    //set position of game over sign
    $gameOver.offset({ top: (278 + boxPosition.top), left: (96 + boxPosition.left) });
    //set z index so that nothing is on top of the sign
    $gameOver.css("z-index", 5);

    //reloads page when the container is clicked to play the game again
    $("section").click(function () { location.reload(); });
}
