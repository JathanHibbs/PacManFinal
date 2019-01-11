/**
 * By: Jathan Hibbs
 * Pac-Man Project
 * CSD 122
 * enemy.js
 * all enemy related function, and enemy class
 */

//using modes object like an enum
const modes = { chase: 0, scatter: 1, scared: 2, eaten: 3 }
//enemy objects
var blinky;
var pinky;
var inky;
var clyde;

class enemy
{
    /**
     * constructs enemy based off the name
     * @param {any} enemyName which enemy to construct
     */
    constructor(enemyName)
    {
        if(enemyName == "blinky")
        {
            //set start pos
            //starts out of starting area
            this.gridX = 7;
            this.gridY = 7;

            //set start direction
            this.direction = directions.left;
            this.nextDirection = directions.left;

            //create jquery object
            this.$enemy = $('<img src="assets/blinky.png"/>').appendTo("section");

            //target tile to start
            this.targetTile = { X: 14, Y: 0 };
            //starts in scatter mode
            this.currentMode = modes.scatter;
            //canChangeDirection object so that the enemy doesnt turn multiple times in the same intersection
            this.canChangeDirection = { canIt: true, X: 0, Y: 0 };

            //update function binded to blinky update function
            this.updateTarget = this.blinkyUpdateTarget.bind(this);

            //changeMode method binded to the object
            this.changeMode = this.changeMode.bind(this);
            //sets timer for switching modes
            this.timer = setTimeout(this.changeMode, 7000);
        }
        else if (enemyName == "pinky")//pretty much the same as blinky
        {
            //starts inside starting area
            this.gridX = 7;
            this.gridY = 9;

            //immediatly exit start area
            this.direction = directions.up;
            this.nextDirection = directions.left;

            this.$enemy = $('<img src="assets/pinky.png"/>').appendTo("section");

            this.targetTile = { X: 0, Y: 0 };
            this.currentMode = modes.scatter;
            this.canChangeDirection = { canIt: true, X: 0, Y: 0 };

            //bind to pinkyUpdateTarget
            this.updateTarget = this.pinkyUpdateTarget.bind(this);

            this.changeMode = this.changeMode.bind(this);
            this.timer = setTimeout(this.changeMode, 7000);
        }
        else if (enemyName == "inky")// pretty much the same as blinky
        {
            this.gridX = 7;
            this.gridY = 9;

            //stay in start area
            this.direction = directions.stop;
            this.nextDirection = directions.stop;

            this.$enemy = $('<img src="assets/inky.png"/>').appendTo("section");

            this.targetTile = { X: 14, Y: 20 };
            this.currentMode = modes.scatter;
            this.canChangeDirection = { canIt: true, X: 0, Y: 0 };

            this.updateTarget = this.inkyUpdateTarget.bind(this);
            //variable so that the enemy doesnt update until it is time
            this.inStartArea = true;

            this.changeMode = this.changeMode.bind(this);
        }
        else if (enemyName == "clyde")//pretty much the same as inky
        {
            this.gridX = 7;
            this.gridY = 9;

            this.direction = directions.stop;
            this.nextDirection = directions.stop;

            this.$enemy = $('<img src="assets/clyde.png"/>').appendTo("section");

            this.targetTile = { X: 0, Y: 20 };
            this.currentMode = modes.scatter;
            this.canChangeDirection = { canIt: true, X: 0, Y: 0 };

            this.updateTarget = this.clydeUpdateTarget.bind(this);
            this.inStartArea = true;

            this.changeMode = this.changeMode.bind(this);
        }
        else
        {
            throw new Error("Illegal enemy name"); //thow error if incorrect name
        }

        //set position based off of the enemy start position
        let boxPosition = $("section").position();
        this.$enemy.offset({ top: ((this.gridY * gridPixelSize) + boxPosition.top), left: ((this.gridX * gridPixelSize) + boxPosition.left) });
        //render above pellets
        this.$enemy.css("z-index", 1);

        //bind update movement to object
        this.updateMovement = this.updateMovement.bind(this);
        //call updateMovement every 30 miliseconds. variable so that i can stop all movement on player death
        this.updateInterval = setInterval(this.updateMovement, 30);
        //start at wave one
        this.wave = 1;
        //start move speed at 2.5
        this.moveSpeed = 2.5;
        //bind reverseMovement function
        this.reverseMovement = this.reverseMovement.bind(this);

        //set name
        this.name = enemyName;
        this.exitScaredMode = this.exitScaredMode.bind(this);
    }

    /**
     * swap modes, operates on timer
     */
    changeMode()
    {
        //swaps to scatter if current mode is chase
        if (this.currentMode == modes.chase)
        {
            //different time until swap depending on wave
            if (this.wave <= 2) {
                this.currentMode = modes.scatter;
                this.timer = setTimeout(this.changeMode, 7000);
            }
            else if (this.wave <= 4)
            {
                this.currentMode = modes.scatter;
                this.timer = setTimeout(this.changeMode, 5000);
            }
        }
        else if (this.currentMode == modes.scatter)
        {
            this.currentMode = modes.chase;
            if (this.wave < 4)//after 4th wave, enemy stays in chase mode
            {
                this.timer = setTimeout(this.changeMode, 20000);
            }
            this.wave++;
        }

        //reverse movement when swapping modes
        this.reverseMovement();
    }

    /**
     * resets enemy into normal state
     */
    exitScaredMode()
    {
        //resumes previous mode
        this.currentMode = this.previousMode;

        //reset timer (same as change mode function)
        if (this.currentMode == modes.chase)
        {
            if (this.wave <= 2)
            {
                this.timer = setTimeout(this.changeMode, 7000);
            }
            else if (this.wave <= 4)
            {
                this.timer = setTimeout(this.changeMode, 5000);
            }
        }
        else if (this.currentMode == modes.scatter)
        {
            if (this.wave < 4)
            {
                this.timer = setTimeout(this.changeMode, 20000);
            }
        }

        //resets sprite
        if (this.name == "blinky")
        {
            this.$enemy.attr("src", "assets/blinky.png");
        }
        else if (this.name == "pinky")
        {
            this.$enemy.attr("src", "assets/pinky.png");
        }
        else if (this.name == "inky")
        {
            this.$enemy.attr("src", "assets/inky.png");
        }
        else if (this.name == "clyde")
        {
            this.$enemy.attr("src", "assets/clyde.png");
        }

        //sets movespeed back to 2.5
        this.moveSpeed = 2.5;
    }

    /**
     * sets target depending on mode for blinky enemy
     */
    blinkyUpdateTarget()
    {
        if (this.currentMode == modes.scatter) //go to top right corner
            this.targetTile = { X: 14, Y: 0 };
        else if (this.currentMode == modes.chase)//go to player pos
            this.targetTile = { X: player.gridX, Y: player.gridY };
        else if (this.currentMode == modes.eaten) //go in front of start area
            this.targetTile = { X: 7, Y: 7 };
    }

    /**
     * sets target depending on mode for pinky enemy
     */
    pinkyUpdateTarget()
    {
        if (this.currentMode == modes.scatter) // go to top left corner
            this.targetTile = { X: 0, Y: 0 };
        else if (this.currentMode == modes.chase) //go to 4 tiles in front of the player
        {
            switch (player.direction)
            {
                case directions.up:
                    this.targetTile = { X: player.gridX, Y: player.gridY - 4 };
                    break;
                case directions.down:
                    this.targetTile = { X: player.gridX, Y: player.gridY + 4 };
                    break;
                case directions.left:
                    this.targetTile = { X: player.gridX - 4, Y: player.gridY };
                    break;
                case directions.right:
                    this.targetTile = { X: player.gridX + 4, Y: player.gridY };
                    break;
                case directions.stop: //if the player is stopped, use the previous direction the player was traveling in
                    switch (player.lastDirection)
                    {
                        case directions.up:
                            this.targetTile = { X: player.gridX, Y: player.gridY - 4 };
                            break;
                        case directions.down:
                            this.targetTile = { X: player.gridX, Y: player.gridY + 4 };
                            break;
                        case directions.left:
                            this.targetTile = { X: player.gridX - 4, Y: player.gridY };
                            break;
                        case directions.right:
                            this.targetTile = { X: player.gridX + 4, Y: player.gridY };
                            break;
                    }
                    break;
            }
        }
        else if (this.currentMode == modes.eaten)//go in front of start area
            this.targetTile = { X: 7, Y: 7 };
    }

    /**
     * sets target depending on mode for inky enemy
     */
    inkyUpdateTarget()
    {
        if (this.currentMode == modes.scatter)//go to bottom right corner
        {
            this.targetTile = { X: 14, Y: 20 };
        }
        else if (this.currentMode == modes.chase) // draws a line from blinky to 2 tiles in front of player, then doubles the length of line
        {
            //tile that is 2 spaces ahead of player
            let playerExpectedPos;

            //finds the tile that is 2 spaces in front of the player
            switch (player.direction)
            {
                case directions.up:
                    playerExpectedPos = { X: player.gridX, Y: player.gridY - 2 };
                    break;
                case directions.down:
                    playerExpectedPos = { X: player.gridX, Y: player.gridY + 2 };
                    break;
                case directions.left:
                    playerExpectedPos = { X: player.gridX - 2, Y: player.gridY };
                    break;
                case directions.right:
                    playerExpectedPos = { X: player.gridX + 2, Y: player.gridY };
                    break;
                case directions.stop: //if the player is stopped, use last direction
                    switch (player.lastDirection)
                    {
                        case directions.up:
                            playerExpectedPos = { X: player.gridX, Y: player.gridY - 2 };
                            break;
                        case directions.down:
                            playerExpectedPos = { X: player.gridX, Y: player.gridY + 2 };
                            break;
                        case directions.left:
                            playerExpectedPos = { X: player.gridX - 2, Y: player.gridY };
                            break;
                        case directions.right:
                            playerExpectedPos = { X: player.gridX + 2, Y: player.gridY };
                            break;
                    }
                    break;
            }
            //draws the line and doubles the length
            this.targetTile = { X: (playerExpectedPos.X - blinky.gridX) * 2, Y: (playerExpectedPos.Y - blinky.gridY) * 2 };
        }
        else if (this.currentMode == modes.eaten)//go to in front of start area
            this.targetTile = { X: 7, Y: 7 };

        //activates enemy when 30 pellets are eaten
        if(this.inStartArea && pelletsEaten >= 30)
        {
            //set direction to go through wall
            this.direction = directions.up;
            //no longer in start area
            this.inStartArea = false;
            //starts the change mode timer
            this.timer = setInterval(this.changeMode, 7000);
        }
    }


    /**
     * sets target depending on mode for clyde enemy
     */
    clydeUpdateTarget()
    {
        if (this.currentMode == modes.scatter)//go to bottom left corner
            this.targetTile = { X: 0, Y: 20 };
        else if (this.currentMode == modes.chase)
        {
            //if the distance between clyde and the player is greater than 8, move towards player
            if (distance(this.gridX, this.gridY, player.gridX, player.gridY) >= 8)
                this.targetTile = { X: player.gridX, Y: player.gridY };
            else //if the enemy is closer than 8 spaces from the player, go to bottom left corner
                this.targetTile = { X: 0, Y: 20 };
        }
        else if (this.currentMode == modes.eaten)//go in front of the start area
            this.targetTile = { X: 7, Y: 7 };

        //exits start area when 50 pellets are eaten
        if (this.inStartArea && pelletsEaten >= 50)
        {
            //same as clyde
            this.direction = directions.up;
            this.inStartArea = false;

            this.timer = setInterval(this.changeMode, 7000);
        }
    }

    /**
     * updates the movement of the enemy, changes direction, and updates position
     */
    updateMovement()
    {
        //update the target tile
        this.updateTarget();

        //position of container
        let boxPosition = $("section").position();
        
        //update grid position
        let checkX = this.$enemy.offset().left;
        let checkY = this.$enemy.offset().top;

        //offset check depending on direction
        if (this.direction == directions.up)
        {
            checkY += gridPixelSize/3;
        }
        else if (this.direction == directions.right)
        {
            checkX -= gridPixelSize / 3;
        }
        else if (this.direction == directions.down)
        {
            checkY -= gridPixelSize / 3;
        }
        else if (this.direction == directions.left)
        {
            checkX += gridPixelSize/3;
        }

        //update grid position
        this.gridX = Math.round((checkX - boxPosition.left) / gridPixelSize);
        this.gridY = Math.round((checkY - boxPosition.top) / gridPixelSize);

        //check if enemy can change direction
        if (isNextTileValid(this.nextDirection, this))
        {
            this.direction = this.nextDirection;
            this.nextDirection = directions.stop;
        }

        //if about to hit a wall, and the tile is not a decision tile, turn in valid direction
        if (!isNextTileValid(this.direction, this) && !isDecisionTile(this.gridX, this.gridY))
        {
            if (getTile(this.gridX + 1, this.gridY) === 0 && this.direction != directions.left)
                this.nextDirection = directions.right;
            else if (getTile(this.gridX - 1, this.gridY) === 0 && this.direction != directions.right)
                this.nextDirection = directions.left;
            else if (getTile(this.gridX, this.gridY + 1) === 0 && this.direction != directions.up)
                this.nextDirection = directions.down;
            else if (getTile(this.gridX, this.gridY - 1) === 0 && this.direction != directions.down)
                this.nextDirection = directions.up;
        }

        //allows enemy to change direction after leaving tile
        if (this.gridX != this.canChangeDirection.X || this.gridY != this.canChangeDirection.Y)
            this.canChangeDirection.canIt = true;

        //move toward target tile
        if(isDecisionTile(this.gridX, this.gridY) && this.canChangeDirection.canIt)
        {
            if (this.currentMode == modes.scared)
            {
                let randDirection;
                let validDirection = false;
                //move randomly while in scared mode
                do
                {
                    //random num 1 - 4
                    let randNum = Math.floor((Math.random() * 4) + 1);
                    

                    //set direction
                    switch (randNum)
                    {
                        case 1:
                            randDirection = directions.up;
                            break;
                        case 2:
                            randDirection = directions.right;
                            break;
                        case 3:
                            randDirection = directions.down;
                            break;
                        case 4:
                            randDirection = directions.left;
                            break;
                    }

                    //check valid
                    switch (randDirection) {
                        case directions.up:
                            if (getTile(this.gridX, this.gridY - 1) == 0 && this.direction != directions.down)
                                validDirection = true;
                            break;
                        case directions.down:
                            if (getTile(this.gridX, this.gridY + 1) == 0 && this.direction != directions.up)
                                validDirection = true;
                            break;
                        case directions.left:
                            if (getTile(this.gridX - 1, this.gridY) == 0 && this.direction != directions.right)
                                validDirection = true;
                            break;
                        case directions.right:
                            if (getTile(this.gridX + 1, this.gridY) == 0 && this.direction != directions.left)
                                validDirection = true;
                            break;
                    }
                } while (!validDirection); //run until it finds a valid direction

                this.nextDirection = randDirection;
            }
            else //move toward target tile
            {
                let closestDirection;
                let closestDirectionDistance;

                if (getTile(this.gridX + 1, this.gridY) == 0 && this.direction != directions.left)//if space to the right is valid, and wont reverse the direction
                {
                    //sets the closest direction
                    closestDirection = directions.right;
                    //sets the closest direction distance
                    closestDirectionDistance = distance(this.gridX + 1, this.gridY, this.targetTile.X, this.targetTile.Y);
                }

                if (getTile(this.gridX - 1, this.gridY) == 0 && this.direction != directions.right)//if space to the left is valid, and wont reverse the direction
                {
                    //distance between tile to the left and the target tile
                    let checkDistance = distance(this.gridX - 1, this.gridY, this.targetTile.X, this.targetTile.Y);
                    //sets the direction and distance if there hasnt been a valid direction yet, or left is closer than right
                    if (closestDirectionDistance == undefined || checkDistance < closestDirectionDistance)
                    {
                        closestDirection = directions.left;
                        closestDirectionDistance = checkDistance
                    }
                }

                if (getTile(this.gridX, this.gridY + 1) == 0 && this.direction != directions.up) //if space to the bottom is valid, and wont reverse the direction
                {
                    //distance between tile below and the target tile
                    let checkDistance = distance(this.gridX, this.gridY + 1, this.targetTile.X, this.targetTile.Y);
                    //sets the direction and distance if there hasnt been a valid direction yet, or if current direction is closer
                    if (closestDirectionDistance == undefined || checkDistance < closestDirectionDistance) 
                    {
                        closestDirection = directions.down;
                        closestDirectionDistance = checkDistance
                    }
                }

                if (getTile(this.gridX, this.gridY - 1) == 0 && this.direction != directions.down)//if space above is valid, and wont reverse the direction
                {
                    //distance between tile below and the target tile
                    let checkDistance = distance(this.gridX, this.gridY - 1, this.targetTile.X, this.targetTile.Y);
                    //sets the direction and distance if there hasnt been a valid direction yet, or if current direction is closer
                    if (closestDirectionDistance == undefined || checkDistance < closestDirectionDistance) 
                    {
                        closestDirection = directions.up;
                        closestDirectionDistance = checkDistance
                    }
                }
                //sets next direction to closest direction
                this.nextDirection = closestDirection;
            }
            //changed direction on this tile, so dont change until tile is left
            this.canChangeDirection.X = this.gridX;
            this.canChangeDirection.Y = this.gridY;
            this.canChangeDirection.canIt = false;
        }

        //update position
        if (this.direction == directions.up)
        {
            this.$enemy.offset({ top: this.$enemy.position().top - this.moveSpeed });
        }
        else if (this.direction == directions.right)
        {
            this.$enemy.offset({ left: this.$enemy.position().left + this.moveSpeed });
        }
        else if (this.direction == directions.down)
        {
            this.$enemy.offset({ top: this.$enemy.position().top + this.moveSpeed });
        }
        else if (this.direction == directions.left)
        {
            this.$enemy.offset({ left: this.$enemy.position().left - this.moveSpeed });
        }

        //teleport code, same as player
        if(this.gridX == 15 && this.gridY == 9)
        {
            if(this.direction != directions.left)
            {
                this.$enemy.offset({ top: ((9 * gridPixelSize) + boxPosition.top), left: ((-1.1 * gridPixelSize) + boxPosition.left) });
                this.nextDirection = directions.right;
            }
        }
        if(this.gridX == -1 && this.gridY == 9)
        {
            if(this.direction != directions.right)
            {
                this.$enemy.offset({ top: ((9 * gridPixelSize) + boxPosition.top), left: ((15 * gridPixelSize) + boxPosition.left) });
                this.nextDirection = directions.left;
            }
        }

        //check player collision
        if (this.gridX == player.gridX && this.gridY == player.gridY)
        {
            //eat enemy
            if (this.currentMode == modes.scared)
            {
                //change mode
                this.currentMode = modes.eaten;
                //change sprite
                this.$enemy.attr("src", "assets/eyes.png");
                //stop timer
                clearTimeout(this.timer);
                //gotta go fast
                this.moveSpeed = 5;
                //increase score
                score += 500;
            }
            else if (this.currentMode != modes.eaten) //kill player
            {
                //call player death function
                playerDeath();
            }
        }

        //if in eaten mode, and in front of start area, reset enemy to normal mode
        if (this.currentMode == modes.eaten && this.gridX == 7 && this.gridY == 7)
            this.exitScaredMode();
    }

    /**
     * reverse movement of enemy
     */
    reverseMovement()
    {
        //change direction depending on the current direction
        switch (this.direction)
        {
            case directions.up:
                this.nextDirection = directions.down;
                break;
            case directions.down:
                this.nextDirection = directions.up;
                break;
            case directions.left:
                this.nextDirection = directions.right;
                break;
            case directions.right:
                this.nextDirection = directions.left;
                break;
        }
    }
}

/**
 * create the 4 enemies
 */
function setupEnemies()
{
    //construct enemies
    blinky = new enemy("blinky");
    pinky = new enemy("pinky");
    inky = new enemy("inky");
    clyde = new enemy("clyde");
}

/**
 * called when big pellet is eaten
 */
function scareEnemies()
{
    //runs if ghost is not already in scared mode, and not eaten
    if (blinky.currentMode != modes.scared && blinky.currentMode != modes.eaten)
    {
        //save old mode so that it can resume later
        blinky.previousMode = blinky.currentMode;
        //reverse movement
        blinky.reverseMovement();
        //change mode to scared
        blinky.currentMode = modes.scared;
        //change sprite
        blinky.$enemy.attr("src", "assets/vulnerable.png");
        //slow enemy down
        blinky.moveSpeed = 1.5;
    }
    if (pinky.currentMode != modes.scared && pinky.currentMode != modes.eaten)//see above
    {
        pinky.previousMode = pinky.currentMode;
        pinky.reverseMovement();
        pinky.currentMode = modes.scared;
        pinky.$enemy.attr("src", "assets/vulnerable.png");
        pinky.moveSpeed = 1.5;
    }

    //runs if ghost is not eaten, so that if another pellet is eaten, timer will reset
    if (blinky.currentMode != modes.eaten)
    {
        clearTimeout(blinky.timer);
        blinky.timer = setTimeout(blinky.exitScaredMode, 7000);
    }

    if (pinky.currentMode != modes.eaten)//see above
    {
        clearTimeout(pinky.timer);
        pinky.timer = setTimeout(pinky.exitScaredMode, 7000);
    }

    //inky and clyde will not change if in starting area
    if (!inky.inStartArea)
    {
        if (inky.currentMode != modes.scared && inky.currentMode != modes.eaten) //see above
        {
            inky.previousMode = inky.currentMode;
            inky.reverseMovement();
            inky.currentMode = modes.scared;
            inky.$enemy.attr("src", "assets/vulnerable.png");
            inky.moveSpeed = 1.5;
        }

        if (inky.currentMode != modes.eaten)
        {
            clearTimeout(inky.timer);
            inky.timer = setTimeout(inky.exitScaredMode, 7000);
        }
    }

    if (!clyde.inStartArea)//pretty much the same
    {
        if (clyde.currentMode != modes.scared && clyde.currentMode != modes.eaten)
        {
            clyde.previousMode = clyde.currentMode;
            clyde.reverseMovement();
            clyde.currentMode = modes.scared;
            clyde.$enemy.attr("src", "assets/vulnerable.png");
            clyde.moveSpeed = 1.5;
        }

        
        if (clyde.currentMode != modes.eaten)
        {
            clearTimeout(clyde.timer);
            clyde.timer = setTimeout(clyde.exitScaredMode, 7000);
        }
    }
}