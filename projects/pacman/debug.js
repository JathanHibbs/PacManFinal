/**
 * By: Jathan Hibbs
 * Pac-Man Project
 * CSD 122
 * debug.js
 * creates a debug map of the 2D array
 */

/*
 * spawns a bunch of squares to show the 2D array
 */
function createDebugMap()//I only used this at the very begining when setting up the map
{
    //display info
    console.table(getMap());
    console.log("table created");

    var boxPosition = $("section").position();
    //loop though whole map
    for (let i = 0; i < getMap()[0].length; i++)
    {
        for (let j = 0; j < getMap().length; j++)
        {
            //if tile is wall
            if (getTile(i, j) == 1) 
            {
                //create sprite
                let tile = $('<img src="assets/debugWall.png" />').appendTo("section");
                //set position
                tile.offset({ top: ((j * 32) + boxPosition.top), left: ((i * 32) + boxPosition.left) });
            }
            //console.log(getTile(j, i));
        }
    }
}