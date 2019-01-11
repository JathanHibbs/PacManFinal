/**
 * By: Jathan Hibbs
 * Pac-Man Project
 * CSD 122
 * pellets.js
 * spawns pellets, and checks collision between pellet and player
 */
//number of pellets eaten
var pelletsEaten = 0;
//number of pellets
var numOfPellets = 0;

/**
 * spawns all the pellets
 */
function spawnPellets()
{
    var boxPosition = $("section").position();
    //loop through whole map
    for (let i = 0; i < getMap()[0].length; i++)
    {
        for (let j = 0; j < getMap().length; j++)
        {
            if ((i == 1 && j == 4) || (i == 13 && j == 4) || (i == 1 && j == 14) || (i == 13 && j == 14))//if the position is where a big pellet is supposed to be
            {
                //create object, and jquery element
                let bigPellet = { $pellet: $('<img src="assets/bigPellet.png" />').appendTo("section"), gridX: i, gridY: j, isBigPellet: true };
                //set position
                bigPellet.$pellet.offset({ top: ((j * 32) + boxPosition.top), left: ((i * 32) + boxPosition.left) });
                //add checkPlayerCollision Method that is binded
                bigPellet.checkPlayerCollision = checkPlayerOverlap.bind(bigPellet);
                //call collision check every 50 miliseconds
                bigPellet.timer = setInterval(bigPellet.checkPlayerCollision, 50);

                //increase numOfPellets
                numOfPellets++;
            }
            else if (getTile(i, j) === 0)//pretty much the same as above
            {
                let pellet = { $pellet: $('<img src="assets/pellet.png" />').appendTo("section"), gridX: i, gridY: j, isBigPellet:false};
                pellet.$pellet.offset({ top: ((j * 32) + boxPosition.top), left: ((i * 32) + boxPosition.left) });
                
                pellet.checkPlayerCollision = checkPlayerOverlap.bind(pellet);
                pellet.timer = setInterval(pellet.checkPlayerCollision, 50);
                
                numOfPellets++;
            }
        }
    }
}

/**
 * checks if the player is on top of pellet
 */
function checkPlayerOverlap()
{
    //if the player is on top of the pellet
    if(distance(this.gridX, this.gridY, player.gridX, player.gridY) == 0)
    {
        //stop checking collision
        clearInterval(this.timer);
        //hide pellet
        this.$pellet.hide();
        //increase score
        score += 10;
        //increase pellets eaten
        pelletsEaten++;

        //if the pellet is big, scare enemies
        if (this.isBigPellet == true)
            scareEnemies();

        if (pelletsEaten == numOfPellets)
            win();
    }
}

/**
 * displays win sign and adds ability to reset game
 */
function win()
{
    console.log("you Win!");
    //reset timers that update all the enemies and player
    clearInterval(blinky.updateInterval);
    clearInterval(pinky.updateInterval);
    clearInterval(inky.updateInterval);
    clearInterval(clyde.updateInterval);
    clearInterval(player.updateInterval);
    //show win sprite
    var $youWin = $('<img src="assets/youWin.png"/>').appendTo("section");

    //position of container
    let boxPosition = $("section").position();
    //set position of game over sign
    $youWin.offset({ top: (278 + boxPosition.top), left: (132 + boxPosition.left) });
    //set z index so that nothing is on top of the sign
    $youWin.css("z-index", 5);

    //reloads page when the container is clicked to play the game again
    $("section").click(function () { location.reload(); });
}
                       