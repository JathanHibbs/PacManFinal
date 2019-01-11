/**
 * By: Jathan Hibbs
 * Pac-Man Project
 * CSD 122
 * mapFunctions.js
 * creates the 2D array and contains accessor functions such as getTile
 */
//public map variable contains 2D array
var map;

/**
 * creates the 2D array
 */
function setupMap()
{
    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
}

/**
 * accessor method, returns the 2D array
 */
function getMap()
{
    return map;
}

/**
 * returns the value of the tile at the x,y position
 * @param {any} x the x position
 * @param {any} y the y position
 */
function getTile(x, y)
{
    return map[y][x];
}

/**
 * returns true if there are 3 or more accessable tiles next to the tile
 * @param {any} x the x position
 * @param {any} y the y position
 */
function isDecisionTile(x, y)
{
    //if the tile to check is not valid, it will return false
    if(getTile(x, y) == 0)
    {
        //number of accessable sides
        let options = 0;

        //checks each side, and if available, adds to options
        if(getTile(x+1, y) == 0)
            options++;

        if(getTile(x-1, y) == 0)
            options++;

        if(getTile(x, y+1) == 0)
            options++;

        if(getTile(x, y-1) == 0)
            options++;

        //return true if there are 3 or more options
        if(options >= 3)
            return true;
    }
    return false;
}

/**
 * returns a boolean that indicates if the next tile is valid based off of the object's direction
 * @param {any} direction the current direction of the object
 * @param {any} object the object that is being checked
 */
function isNextTileValid(direction, object)
{
    //check each direction
    if (direction == directions.up)
    {
        //if tile is valid, return true
        if (getTile(object.gridX, object.gridY - 1) != 1)
        {
            return true;
        }
    }
    else if (direction == directions.right)
    {
        //if tile is valid, return true
        if (getTile(object.gridX + 1, object.gridY) != 1)
        {
            return true;
        }
    }
    else if (direction == directions.down)
    {
        //if tile is valid, return true
        if (getTile(object.gridX, object.gridY + 1) != 1)
        {
            return true;
        }
    }
    else if (direction == directions.left)
    {
        //if tile is valid, return true
        if (getTile(object.gridX - 1, object.gridY) != 1)
        {
            return true;
        }
    }

    //if no direction is true, return false
    return false
}

/**
 * returns the distance between 2 points
 * @param {any} x1 x coordinate of the first point
 * @param {any} y1 y coordinate of the first point
 * @param {any} x2 x coordinate of the second point
 * @param {any} y2 y coordinate of the second point
 */
function distance(x1, y1, x2, y2)
{
    //distance formula
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2-y1, 2));
}