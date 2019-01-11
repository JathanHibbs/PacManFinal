/**
 * By: Jathan Hibbs
 * Pac-Man Project
 * CSD 122
 * setup.js
 * sets up the game, creates all the objects to start
 */

/*
    calls all setup functions when the document is fully loaded
*/
$(document).ready(function () 
{
    //creates 2D array map
    setupMap();
    //creates player object
    setupPlayer();
    //create enemy objects
    setupEnemies();
    //create pellets
    spawnPellets();
    //creates a debug map to show the 2D array
    //createDebugMap();
});