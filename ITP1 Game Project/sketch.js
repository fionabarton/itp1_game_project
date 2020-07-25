/*

The Game Project 6 - Final Project

// >-----------------------------------------<
//      Extension 1: Add advanced graphics  
// >-----------------------------------------<

Drawing objects by typing numbers into a function was considerably more tedious than using a pen and paper. Still, it was a nice exercise (and test of patience!) being pressed to conjure up somewhat reasonable imagery with an unfamiliar toolset, p5.js. 

Clouds:
- Each cloud slowly scrolls to the left. If it reaches the far left side of the scene, it's repositioned to the far right side of the scene.

Shadows: 
- If an object (collectable or enemy) is above the ground or a platform, its shadow appears on the ground or platform directly below it. 
- If an object is above a canyon, no shadow appears.

A slight sense of depth:
- Trees are placed both in front of and behind the player (trees in the foreground are slightly transparent so the player can see themself). 
- The player is not placed directly on top of the ground & platforms, but rather slightly below making the scene appear slightly more three dimensional.

In order to attract the player's eye to the game character, enemies and collectables:
- The outside of enemies' floating bodies flicker like the wings of an insect.
- The size of collectables pulsate at a much slower rate.
- There's a black stroke around the game character, enemies, & collectables (excluding their shadows).

Text: 
- To spice up the somewhat plain looking web-safe font, I added a "shadow".

// >-----------------------------------------<
//           Extension 2: Add sound
// >-----------------------------------------<

My initial, overly ambitious idea was to write and record all of the sound effects and music using real instruments (guitar, bass guitar & drums). This was accomplished, but the end result was undesireable. Back to square one!

I eventually settled on complementing the "simplistic" graphics with "simplistic" sounds. Enter MIDI. I wrote and programmed all of the sounds/music in the digital audio workstation Reaper using its built-in synth plugin.

This project features sounds/music for:
- The background music.
- Completing a level.
- Falling into a canyon.
- Getting a game over by losing all 3 lives.
- Player jumping.
- Player damaged by enemy.
- Player contact with collectable. 8 sounds total. Loops up through the notes of the major scale matching the key of the BGM, A major: A, B, C#, D, E, F#, G#, A. 

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var treesX;
var collectables;
var canyons; 

var game_score;
var flagpole;

var platforms;
var enemies;

var onPlatform;

// Sounds
var bgmIsLooping;
var bgmSND;
var jumpSND;
var damageSND;
var canyonSND;
var levelCompleteSND;
var gameOverSND;

// Collectable Sounds
var collectableSND1, collectableSND2, collectableSND3, collectableSND4, collectableSND5, collectableSND6, collectableSND7, collectableSND8;
var collectableSNDS = [];
var collectableSNDNdx;

var gamePaused; 

function preload()
{
    soundFormats('mp3');
    masterVolume(0.25);
    
    // Load the sounds!
    jumpSND = loadSound('assets/ITP1_Jump.mp3');
    canyonSND = loadSound('assets/ITP1_Canyon_Fall.mp3');
    damageSND = loadSound('assets/ITP1_Damage.mp3');
    levelCompleteSND = loadSound('assets/ITP1_Level_Complete.mp3');
    gameOverSND = loadSound('assets/ITP1_Game_Over.mp3');
    bgmSND = loadSound('assets/ITP1_Music.mp3');
    
    collectableSND1 = loadSound('assets/ITP1_Collectable_1.mp3');
    collectableSND2 = loadSound('assets/ITP1_Collectable_2.mp3');
    collectableSND3 = loadSound('assets/ITP1_Collectable_3.mp3');
    collectableSND4 = loadSound('assets/ITP1_Collectable_4.mp3');
    collectableSND5 = loadSound('assets/ITP1_Collectable_5.mp3');
    collectableSND6 = loadSound('assets/ITP1_Collectable_6.mp3');
    collectableSND7 = loadSound('assets/ITP1_Collectable_7.mp3');
    collectableSND8 = loadSound('assets/ITP1_Collectable_8.mp3');
    
    collectableSNDS.push(collectableSND1);
    collectableSNDS.push(collectableSND2);
    collectableSNDS.push(collectableSND3);
    collectableSNDS.push(collectableSND4);
    collectableSNDS.push(collectableSND5);
    collectableSNDS.push(collectableSND6);
    collectableSNDS.push(collectableSND7);
    collectableSNDS.push(collectableSND8);
}

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    console.log(floorPos_y);
    lives = 3;  

    startGame();	
}

function startGame(){
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft, isRight, isFalling, isPlummeting = false;

    // Initialise arrays of scenery objects.
    trees_x = [-580, -85, 15, 520, 1375, 1900, 2500, 3700, 3900];
    trees_y = [15, 5, 0, 10, 5, 15, 0, 5, 15];
    
    treesForeground_x = [-500, 290, 400, 900, 1300, 2000, 2300, 3800, 4000];
    treesForeground_y = [80, 100, 120, 80, 120, 100, 80, 120, 80];
    
    clouds = [
        {x_pos: -1100, y_pos: 50, size: 2}, 
        {x_pos: -8000, y_pos: 110, size: 3}, 
        {x_pos: -700, y_pos: 100, size: 2.5},
        {x_pos: -200, y_pos: 120, size: 2},
        {x_pos: 100, y_pos: 90, size: 3},
        {x_pos: 400, y_pos: 60, size: 2}, 
        {x_pos: 700, y_pos: 110, size: 2.5}, 
        {x_pos: 1000, y_pos: 80, size: 3}, 
        {x_pos: 1250, y_pos: 110, size: 2.5}, 
        {x_pos: 1300, y_pos: 60, size: 2},
        {x_pos: 1800, y_pos: 90, size: 3},
        {x_pos: 2400, y_pos: 90, size: 3},
        {x_pos: 2900, y_pos: 70, size: 2},
        {x_pos: 3200, y_pos: 60, size: 2.5},
        {x_pos: 3600, y_pos: 130, size: 3}
    ];
    
    mountains = [
        {x_pos: -1300, y_pos: 100, size: 40}, 
        {x_pos: -800, y_pos: 100, size: 250}, 
        {x_pos: 200, y_pos: 100, size: 100},
        {x_pos: 800, y_pos: 100, size: 70}, 
        {x_pos: 1700, y_pos: 100, size: 100}, 
        {x_pos: 2000, y_pos: 100, size: 70}, 
        {x_pos: 2600, y_pos: 100, size: 250},
        {x_pos: 3000, y_pos: 100, size: 70}
    ];
    
    canyons = [
        {x_pos: -1500, y_pos: floorPos_y, size: 50, width: 750}, 
        {x_pos: -500, y_pos: floorPos_y, size: 50, width: 250}, 
        {x_pos: 0, y_pos: floorPos_y, size: 50, width: 100}, 
        {x_pos: 975, y_pos: floorPos_y, size: 50, width: 100}, 
        {x_pos: 1425, y_pos: floorPos_y, size: 50, width: 250}, 
        {x_pos: 2000, y_pos: floorPos_y, size: 50, width: 100},
        {x_pos: 2500, y_pos: floorPos_y, size: 50, width: 1000}  
    ];

    collectables = [
        {x_pos: -537.5, y_pos: 40, size: 10, isFound: false, shadowYPos: 35}, 
        {x_pos: -537.5, y_pos: 90, size: 10, isFound: false, shadowYPos: 35}, 
        {x_pos: -537.5, y_pos: 140, size: 10, isFound: false, shadowYPos: 35}, 
        {x_pos: -537.5, y_pos: 190, size: 10, isFound: false, shadowYPos: 35}, 
        {x_pos: -537.5, y_pos: 240, size: 10, isFound: false, shadowYPos: 35}, 
        {x_pos: -537.5, y_pos: 290, size: 10, isFound: false, shadowYPos: 35}, 
        {x_pos: -537.5, y_pos: 340, size: 10, isFound: false, shadowYPos: 35}, 

        {x_pos: -137.5, y_pos: 390, size: 10, isFound: false, shadowYPos: 35}, 
        {x_pos: -87.5, y_pos: 390, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: -37.5, y_pos: 390, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 12.5, y_pos: 390, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 62.5, y_pos: 390, size: 10, isFound: false, shadowYPos: 35},

        {x_pos: 575, y_pos: 427.5, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 625, y_pos: 427.5, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 675, y_pos: 427.5, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 725, y_pos: 427.5, size: 10, isFound: false, shadowYPos: 35},

        {x_pos: 962.5, y_pos: 40, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 975, y_pos: 90, size: 10, isFound: false, shadowYPos: 35}, 
        
        {x_pos: 1075, y_pos: 315, size: 10, isFound: false, shadowYPos: 0}, 
        {x_pos: 1112.5, y_pos: 340, size: 10, isFound: false, shadowYPos: 0}, 
        {x_pos: 1112.5, y_pos: 290, size: 10, isFound: false, shadowYPos: 0}, 
        {x_pos: 1150, y_pos: 315, size: 10, isFound: false, shadowYPos: 0}, 
        
        {x_pos: 1250, y_pos: 40, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 1237.5, y_pos: 90, size: 10, isFound: false, shadowYPos: 35}, 

        {x_pos: 1450, y_pos: 390, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 1487.5, y_pos: 340, size: 10, isFound: false, shadowYPos: 35},
        
        {x_pos: 1537.5, y_pos: 315, size: 10, isFound: false, shadowYPos: 0}, 
        {x_pos: 1587.5, y_pos: 315, size: 10, isFound: false, shadowYPos: -75},
        {x_pos: 1637.5, y_pos: 315, size: 10, isFound: false, shadowYPos: -75},
        {x_pos: 1687.5, y_pos: 315, size: 10, isFound: false, shadowYPos: -75}, 
        {x_pos: 1737.5, y_pos: 315, size: 10, isFound: false, shadowYPos: 0}, 
        
        {x_pos: 1787.5, y_pos: 340, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 1825, y_pos: 390, size: 10, isFound: false, shadowYPos: 35},

        {x_pos: 2137.5, y_pos: 340, size: 10, isFound: false, shadowYPos: 0}, 
        {x_pos: 2137.5, y_pos: 290, size: 10, isFound: false, shadowYPos: 0}, 

        {x_pos: 2562.5, y_pos: 40, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 2562.5, y_pos: 90, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 2562.5, y_pos: 140, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 2562.5, y_pos: 190, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 2562.5, y_pos: 240, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 2562.5, y_pos: 290, size: 10, isFound: false, shadowYPos: 35},
        {x_pos: 2562.5, y_pos: 340, size: 10, isFound: false, shadowYPos: 35},

        {x_pos: 2712.5, y_pos: 240, size: 10, isFound: false, shadowYPos: -75},
        {x_pos: 2787.5, y_pos: 240, size: 10, isFound: false, shadowYPos: -75},
        {x_pos: 3050, y_pos: 265, size: 10, isFound: false, shadowYPos: -50},
        {x_pos: 3100, y_pos: 265, size: 10, isFound: false, shadowYPos: -50},
        {x_pos: 3350, y_pos: 240, size: 10, isFound: false, shadowYPos: -75},
        {x_pos: 3425, y_pos: 240, size: 10, isFound: false, shadowYPos: -75}   
    ];
    
    // Platforms
    platforms = [];

    platforms.push(createPlatforms(-337.5, floorPos_y - 325, 100));
    platforms.push(createPlatforms(-362.5, floorPos_y - 100, 150));
    platforms.push(createPlatforms(-125, floorPos_y - 200, 200));
    platforms.push(createPlatforms(550, floorPos_y - 75, 200));
    platforms.push(createPlatforms(775, floorPos_y - 200, 100));
    platforms.push(createPlatforms(1062.5, floorPos_y - 250, 100));
    
    platforms.push(createPlatforms(1375, floorPos_y - 200, 100));
    platforms.push(createPlatforms(1537.5, floorPos_y - 75, 200));
    platforms.push(createPlatforms(1800, floorPos_y - 200, 100));
    platforms.push(createPlatforms(2012.5, floorPos_y - 300, 250));
    platforms.push(createPlatforms(2375, floorPos_y - 200, 100));
    
    platforms.push(createPlatforms(2650, floorPos_y - 75, 200));
    platforms.push(createPlatforms(3000, floorPos_y - 50, 150));
    platforms.push(createPlatforms(3287.5, floorPos_y - 75, 200));
    
    // Enemies
    enemies = [];

    enemies.push(new Enemy(-850, floorPos_y - 10, 100, true, 0));
    enemies.push(new Enemy(-800, floorPos_y - 125, 100, false, 0));
    enemies.push(new Enemy(-850, floorPos_y - 150, 100, true, 0));
    enemies.push(new Enemy(-800, floorPos_y - 275, 100, false, 0));
    enemies.push(new Enemy(-850, floorPos_y - 290, 100, true, 0));
    enemies.push(new Enemy(-800, floorPos_y - 425, 100, false, 0));
    
    enemies.push(new Enemy(-87.5, floorPos_y - 10, 100, true, 35));
    
    enemies.push(new Enemy(962.5, floorPos_y - 325, 100, false, 35));
    enemies.push(new Enemy(1062.5, floorPos_y - 25, 100, true, 0));
    enemies.push(new Enemy(1262.5, floorPos_y - 325, 100, false, 35));

    enemies.push(new Enemy(1962.5, floorPos_y - 325, 100, false, 35));
    enemies.push(new Enemy(2085.5, floorPos_y - 25, 100, true, 0));
    enemies.push(new Enemy(2312.5, floorPos_y - 325, 100, false, 35));

    enemies.push(new Enemy(2937.5, floorPos_y - 0, 100, false, 0));
    enemies.push(new Enemy(2937.5, floorPos_y - 200, 100, false, 0));
    enemies.push(new Enemy(2937.5, floorPos_y - 400, 100, false, 0));
    enemies.push(new Enemy(3200, floorPos_y - 0, 100, false, 0));
    enemies.push(new Enemy(3200, floorPos_y - 200, 100, false, 0));
    enemies.push(new Enemy(3200, floorPos_y - 400, 100, false, 0));
    
    enemies.push(new Enemy(2700, floorPos_y - 25, 100, true, 0));
    enemies.push(new Enemy(3025, floorPos_y - 0, 100, true, 0));
    enemies.push(new Enemy(3337.5, floorPos_y - 25, 100, true, 0));
    
    enemies.push(new Enemy(2700, floorPos_y - 375, 100, true, -75));
    enemies.push(new Enemy(3025, floorPos_y - 400, 100, true, -50));
    enemies.push(new Enemy(3337.5, floorPos_y - 375, 100, true, -75));
    
    game_score = 0;
    
    collectableSNDNdx = 0;

    flagpole = {isReached: false, x_pos: 3700};
    
    gamePaused = false;
    
    // Start Background Music
    if(!bgmIsLooping){
        bgmSND.loop();
        bgmIsLooping = true;
    }   
}

function draw(){
    // Draw Sky
	background(100, 155, 255); // fill the sky blue
    
    noStroke();
	fill(100, 125, 255);
    rect(0, 100, width, 100);
    
    fill(100, 100, 255);
    rect(0, 200, width, 235);

    // Draw Ground
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    push();
    translate(scrollPos,0);

    // Draw clouds.
    drawClouds();
    
	// Draw mountains.
    drawMountains();
    
	// Draw trees.
    drawTrees();
    
    // Draw Path.
    fill(180,100,30);
    rect(-1750,460, 5500, 10)
    fill(150,100,30);
    rect(-1750,470, 5500, 10)
    fill(120,100,30);
    rect(-1750,480, 5500, 10)
    
    // Draw platforms.
    for(var i = 0; i < platforms.length; i++){
        platforms[i].draw();
    }
    
	// Draw canyons.
    for(var i = 0; i < canyons.length; i++){
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    
	// Draw collectable items.
    for (var i = 0; i < collectables.length; i++){
        if(!collectables[i].isFound){
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    
    // Draw Flagpole
    renderFlagpole();
    
    // Draw Enemies
    for(var i = 0; i < enemies.length; i++){
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact){
            CharDie();
        }
    }

    pop();

    // Draw game character.
	drawGameChar(gameChar_x, gameChar_y + 35);

    // Draw Trees in Foreground (in front of game character)
    push();
    translate(scrollPos,0);
    drawForegroundTrees();
    pop();

    // Score and Lives Text
    textFont('Impact');
    
    fill(0,0,0);
    textSize(20.5);
    text("Score: " + game_score, 20, 25);
    text("Lives: ", 885, 25);
        
    fill(255,25,0);
    textSize(20);
    text("Score: " + game_score, 20, 20);
    text("Lives: ", 885, 20);

    // Display Life Tokens
    for (var i = 0; i < lives; i++){
        fill(0,0,0);
        ellipse(950 + i * 20, 15, 15, 15);
        
        fill(255,255,255);
        ellipse(950 + i * 20, 15, 10, 10);
        
        fill(0,0,0);
        ellipse(950 + i * 20, 15, 5, 5);
    }
  
    // Game Over
    if(lives <= 0){
        gamePaused = true;
        
        // Text
        fill(0,0,0);
        textSize(30.5);
        text("Game Over!\nPress space to continue.", 375, 205);
        
        fill(255,25,0);
        textSize(30);
        text("Game Over!\nPress space to continue.", 375, 200);
        return;
    }
    
    // Level Complete
    if(flagpole.isReached){
        gamePaused = true;
        
        // Stop BGM
        bgmSND.stop();
        bgmIsLooping = false;
        
        // Text
        fill(0,0,0);
        textSize(30.5);
        text("Level Complete!\nPress space to continue.", 375, 205);
        
        fill(255,25,0);
        textSize(30);
        text("Level Complete!\nPress space to continue.", 375, 200);
        return;
    }
    
	// Logic to make the game character move or the background scroll.
    if(!isPlummeting){
        
        // Moving Left
        if(isLeft){
            if(gameChar_x > width * 0.2){
                gameChar_x -= 5;
            }else{
                scrollPos += 5;
            }
        }

        // Moving Right
        if(isRight){
            if(gameChar_x < width * 0.8){
                gameChar_x  += 5;
            }else{
                scrollPos -= 5; // negative for moving against the background
            }
        }

        // Logic to make the game character rise and fall.
        if(gameChar_y < floorPos_y){
            
            // On Platform?
            var isContact = false;
            
            for(var i = 0; i < platforms.length; i++){
               if(platforms[i].checkContact(gameChar_world_x, gameChar_y + 30)){
                   isContact = true;
                   isFalling = false;
                   break;
               }
            }
            
            // Glide down from Jump
            if(!isContact){
                gameChar_y += 3;
                isFalling = true;
            }
            
        }else{
            isFalling = false;
        }
        
    }else{
        // Canyon Death
        gameChar_y += 3;  
        
        if(gameChar_y >= 1000){
            CharDie();  
        }
    }
    
    // Check Flagpole
    if(!flagpole.isReached){
       checkFlagpole(); 
    }
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}

// >--------------------------------<
// Key control functions
// >--------------------------------<

function keyPressed(){
    keyboardInput(true);
}

function keyReleased(){
    keyboardInput(false);
}

// Let's save some space with a new function. Woo!
function keyboardInput(tBool){
    switch(keyCode){
        case 37: // "Left Arrow"
        case 65: // "A"
            isLeft = tBool;
            break;
        case 39: // "Right Arrow"
        case 68: // "D"
            isRight = tBool;
            break;
            
// >--------------------------------<
// Game character jump
// >--------------------------------<
        case 32: // "Space Bar"
            // Not plummeting to their death?
            if(!isPlummeting && !flagpole.isReached){
                if(gameChar_y >= floorPos_y){   
                    gameChar_y -=200;
                
                    jumpSND.play();
                }     
            }
            
            // Player on platform?
            for(var i = 0; i < platforms.length; i++){
               if(platforms[i].checkContact(gameChar_world_x, gameChar_y + 30)){
                   gameChar_y -=200;
                    
                   jumpSND.play();
                   break;
               }
            }
            
            // Restart Game 
            if(lives <= 0 || flagpole.isReached){
                // Stop Music
                levelCompleteSND.stop();
                gameOverSND.stop();
                
                // Reset Lives
                lives = 3; 

                startGame();
            }
            break; 
    }
}

// >--------------------------------<
// Game character render function
// >--------------------------------<

// Function to draw the game character.
function drawGameChar(xPos, yPos){
    stroke(0);
    
    // Character jumping-left
	if(isLeft && isFalling){    
        // Back Foot
        fill(150, 70, 100);
        rect(xPos - 2, yPos - 12, 15, 8);

        // Body
        fill(0, 0, 255);
        ellipse(xPos, yPos - 30, 47, 45);

        // Front Foot
        fill(200, 70, 0);
        rect(xPos - 10, yPos - 20, 15, 8);

        // Front Hand
        fill(150, 70, 0);
        ellipse(xPos, yPos - 45, 12, 12);

        // Right Eye
        fill(255, 200, 0);
        triangle(xPos - 20, yPos - 37 , xPos - 5, yPos - 40, xPos - 15, yPos - 32);

        // Mouth
        triangle(xPos - 23, yPos - 25, xPos - 10, yPos - 25, xPos - 19, yPos - 16);
        
    // Character jumping-right 
    }else if(isRight && isFalling){
        // Back Foot
        fill(150, 70, 100);
        rect(xPos - 10, yPos - 12, 15, 8);

        // Body
        fill(0, 0, 255);
        ellipse(xPos, yPos - 30, 47, 45);

        // Front Foot
        fill(200, 70, 0);
        rect(xPos - 3, yPos - 20, 15, 8);

        // Front Hand
        fill(150, 70, 0);
        ellipse(xPos, yPos - 45, 12, 12);

        // Right Eye
        fill(255, 200, 0);
        triangle(xPos + 20, yPos - 37 , xPos + 5, yPos - 40, xPos + 15, yPos - 32);

        // Mouth
        triangle(xPos + 23, yPos - 25, xPos + 10, yPos - 25, xPos + 19, yPos - 16);
   
    // Character walking left 
    }else if(isLeft){
        noStroke();
        
        // Shadow
        fill(0, 0, 0, 100);
        ellipse (xPos, yPos + 2, 50, 7);

        stroke(0);
        
        // Back Foot
        fill(150, 70, 100);
        rect(xPos - 3, yPos - 7, 15, 8);

        // Body
        fill(0, 0, 255);
        ellipse(xPos, yPos - 25, 47, 45);

        // Right Foot
        fill(200, 70, 0);
        rect(xPos - 10, yPos - 7, 15, 8);

        // Right Hand
        fill(150, 70, 0);
        ellipse(xPos + 5, yPos - 20, 10, 10);

        // Right Eye
        fill(255, 200, 0);
        triangle(xPos - 20, yPos - 32, xPos - 5, yPos - 35, xPos - 15, yPos - 27);

        // Mouth
        triangle(xPos - 23, yPos - 20, xPos -10, yPos - 20, xPos - 19, yPos - 15);

    // Character walking right 
    }else if(isRight){
        noStroke();
        
        // Shadow
        fill(0, 0, 0, 100);
        ellipse (xPos, yPos + 2 , 50, 7);

        stroke(0);
        
        // Back Foot
        fill(150, 70, 100);
        rect(xPos - 10, yPos - 7, 15 , 8);

        // Body
        fill(0, 0, 255);
        ellipse(xPos, yPos - 25, 47, 45);

        // Right Foot
        fill(200, 70, 0);
        rect(xPos , yPos - 7, 15, 8);

        // Right Hand
        fill(150, 70, 0);
        ellipse(xPos - 3, yPos - 20, 10, 10);

        // Right Eye
        fill(255, 200, 0);
        triangle(xPos + 20, yPos - 32, xPos + 5, yPos - 35, xPos + 15, yPos - 27);

        // Mouth
        triangle(xPos + 23, yPos - 20, xPos + 10, yPos - 20, xPos + 19, yPos - 15);

    // Character jumping facing forwards 
    }else if(isFalling || isPlummeting){   
        // Right Foot
        fill(150, 70, 100);
        rect(xPos + 5, yPos - 12, 15, 8);

        // Body
        fill(0, 0, 255);
        ellipse(xPos, yPos - 30, 47, 45);

        // Left Foot
        fill(200, 70, 0);
        rect(xPos -20, yPos - 17, 10, 8);

        // Left Eye
        fill(255, 200, 0);
        triangle(xPos - 15, yPos - 40, xPos - 3, yPos - 39, xPos - 3, yPos - 32);
        // Right Eye
        triangle(xPos + 5, yPos - 39, xPos + 17, yPos - 40, xPos + 5, yPos - 32);

        // Mouth
        triangle(xPos - 10, yPos - 25, xPos + 10, yPos - 25, xPos, yPos - 15);

        // Left Hand 
        fill(150, 70, 0);
        ellipse(xPos - 19, yPos - 20, 10, 10);
        // Right Hand
        ellipse(xPos + 20, yPos - 40, 12, 12); 
  
    // Character standing front facing 
    }else{
        noStroke();
        
        // Shadow
        fill(0, 0, 0, 100);
        ellipse (xPos, yPos + 2, 50, 7);

        stroke(0);
        
        // Left Foot
        fill(200, 70, 0);
        rect(xPos - 20, yPos - 7, 15, 8);

        // Right Foot
        rect(xPos + 5, yPos - 7, 15, 8);
        // Body
        fill(0, 0, 255);
        ellipse(xPos, yPos - 25, 47, 45);

        // Left Hand 
        fill(150, 70, 0);
        ellipse(xPos - 19, yPos - 20, 10, 10);
        // Right Hand
        ellipse(xPos + 20, yPos - 20, 10, 10);

        // Left Eye
        fill(255, 200, 0);
        triangle(xPos - 15, yPos - 35, xPos - 3, yPos - 33, xPos - 3, yPos - 27);
        // Right Eye
        triangle(xPos + 5, yPos - 33, xPos + 17, yPos - 35, xPos + 5, yPos - 27);

        // Mouth
        triangle(xPos - 10, yPos - 20, xPos + 10, yPos - 20, xPos, yPos - 15);
    }
    noStroke();
}

// >--------------------------------<
// Background render functions
// >--------------------------------<

// Function to draw cloud objects.
function drawClouds(){
        // Draw Cloud
        for (var i = 0; i < clouds.length; i++){
        // Center Cloud
        fill(255, 255, 255);
        ellipse(clouds[i].x_pos + 75, clouds[i].y_pos, 
                clouds[i].size * 50, clouds[i].size * 50);

        // Left & Right Clouds
        ellipse(clouds[i].x_pos + 25, clouds[i].y_pos, 
                clouds[i].size * 40, clouds[i].size * 40);
        ellipse(clouds[i].x_pos + 125, clouds[i].y_pos, 
                clouds[i].size * 40, clouds[i].size * 40);

        // FAR Left & Right Clouds
        fill(255, 255, 255, 240);
        ellipse(clouds[i].x_pos, clouds[i].y_pos, 
                clouds[i].size * 30, clouds[i].size * 30);
        ellipse(clouds[i].x_pos + 150, clouds[i].y_pos, 
                clouds[i].size * 30, clouds[i].size * 30);
        
        // Scroll Clouds to Left
        switch(clouds[i].size){
            case 2:
                clouds[i].x_pos -= 0.1;
                break;
            case 2.5:
                clouds[i].x_pos -= 0.2;
                break;
            case 3:
            default:
                clouds[i].x_pos -= 0.3;
                break;
        }
        
        // Recycle Cloud if scrolls to far left
        if(clouds[i].x_pos <= -1500){
            clouds[i].x_pos = 3750;
        }
    }
}

// Function to draw mountains objects.
function drawMountains(){
    for(var i = 0; i < mountains.length; i++){
        fill(200, 200, 255, 175);
        triangle(
            mountains[i].x_pos + mountains[i].size + 350, mountains[i].y_pos + 156, 
            mountains[i].x_pos + 150, mountains[i].y_pos + 332, 
            mountains[i].x_pos + mountains[i].size + 600, mountains[i].y_pos + 332);

        // Mountain Mid
        fill(175, 100, 255, 200);
        triangle(
            mountains[i].x_pos + mountains[i].size + 450, mountains[i].y_pos + 227, 
            mountains[i].x_pos + 300, mountains[i].y_pos + 332, 
            mountains[i].x_pos + mountains[i].size + 650, mountains[i].y_pos + 332);

        // Mountain Front
        fill(155, 100, 255, 225);
        triangle(
            mountains[i].x_pos + mountains[i].size + 300, mountains[i].y_pos + 250, 
            mountains[i].x_pos + 150, mountains[i].y_pos + 332, 
            mountains[i].x_pos + mountains[i].size + 550, mountains[i].y_pos + 332);
    }
}

// Function to draw trees objects.
function drawTrees(){
    for(var i = 0; i < trees_x.length; i++){
        // Shadow
        fill(0,0,0,30);
        ellipse(trees_x[i] - 5, floorPos_y + trees_y[i] + 10, 125, 15);

        // Trunk
        fill(100,50,10);
        rect(trees_x[i] - 15, floorPos_y + trees_y[i] - 140, 25, 150);
        fill(125,50,10);
        triangle(trees_x[i] - 40, floorPos_y + trees_y[i] + 10,
                 trees_x[i] -15, floorPos_y + trees_y[i] - 5,
                 trees_x[i] - 15, floorPos_y + trees_y[i] + 10);
        triangle(trees_x[i] +35, floorPos_y + trees_y[i] + 10,
                 trees_x[i] +10, floorPos_y + trees_y[i] - 5,
                 trees_x[i] - 15, floorPos_y + trees_y[i] + 10);

        // Leaves
        fill(50,120,0);
        ellipse(trees_x[i], treesForeground_y[i] + 210, 150, 125);
    }
}

function drawForegroundTrees(){
    for(var i = 0; i < treesForeground_x.length; i++){
        // Shadow
        fill(0,0,0,30);
        ellipse(treesForeground_x[i] - 5, floorPos_y + treesForeground_y[i] + 10, 125, 15);

        // Trunk
        fill(100,50,10, 225);
        rect(treesForeground_x[i] - 15, floorPos_y + treesForeground_y[i] - 60, 25, 70);
        fill(125,50,10, 225);
        triangle(treesForeground_x[i] - 40, floorPos_y + treesForeground_y[i] + 10,
                 treesForeground_x[i] -15, floorPos_y + treesForeground_y[i] - 5,
                 treesForeground_x[i] - 15, floorPos_y + treesForeground_y[i] + 10);
        triangle(treesForeground_x[i] +35, floorPos_y + treesForeground_y[i] + 10,
                 treesForeground_x[i] +10, floorPos_y + treesForeground_y[i] - 5,
                 treesForeground_x[i] - 15, floorPos_y + treesForeground_y[i] + 10);

        // Leaves
        fill(50,120,0, 235);
        ellipse(treesForeground_x[i], treesForeground_y[i] + 300, 175, 150);
    }
}

// >--------------------------------<
// Canyon render and check functions
// >--------------------------------<

// Function to draw canyon objects.
function drawCanyon(t_canyon){
    fill(150,50,10);
    quad(t_canyon.x_pos + 80, t_canyon.y_pos, 
         t_canyon.x_pos + t_canyon.width + 90, t_canyon.y_pos,
         t_canyon.x_pos + t_canyon.width + 110, t_canyon.y_pos + 143, 
         t_canyon.x_pos + 60, t_canyon.y_pos + 143);

    fill(110,50,10);
    quad(t_canyon.x_pos + 90, t_canyon.y_pos, 
         t_canyon.x_pos + t_canyon.width + 80, t_canyon.y_pos, 
         t_canyon.x_pos + t_canyon.width + 110, t_canyon.y_pos + 143, 
         t_canyon.x_pos + 60, t_canyon.y_pos + 143);

    fill(70,50,10);
    quad(t_canyon.x_pos + 100, t_canyon.y_pos, 
         t_canyon.x_pos + t_canyon.width + 70, t_canyon.y_pos,
         t_canyon.x_pos + t_canyon.width + 110, t_canyon.y_pos + 143, 
         t_canyon.x_pos + 60, t_canyon.y_pos + 143);

    fill(40,50,10);
    quad(t_canyon.x_pos + 110, t_canyon.y_pos, 
         t_canyon.x_pos + t_canyon.width + 60, t_canyon.y_pos,
         t_canyon.x_pos + t_canyon.width + 110, t_canyon.y_pos + 143, 
         t_canyon.x_pos + 60, t_canyon.y_pos + 143);
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon){
    if(gameChar_world_x >= t_canyon.x_pos + 110 && 
       gameChar_world_x <= t_canyon.x_pos + t_canyon.width + 60 && 
       gameChar_y >= floorPos_y){
        
        if(!gamePaused && !canyonSND.isPlaying()){
            // Stop BGM
            bgmSND.stop();
            bgmIsLooping = false;
            
            if(lives <= 1){
                if(!gameOverSND.isPlaying()){
                    gameOverSND.play();
                }
            }else{
                canyonSND.play();
            }
        }
        isPlummeting = true;
        isFalling = true; // Displays character falling sprite
    } 
}

// >--------------------------------<
// Collectable items render and check functions
// >--------------------------------<

// Function to draw collectable objects.
function drawCollectable(t_collectable){

    // Shadow
    if(t_collectable.shadowYPos != 0){
        fill(0,0,0,30);
        ellipse(t_collectable.x_pos, floorPos_y + t_collectable.shadowYPos, 25, 15); // 35
    }
    
    stroke(0);
    
    fill(255,100,100);
    ellipse(t_collectable.x_pos, t_collectable.y_pos + 8, 
            t_collectable.size + 25, t_collectable.size + 25);
    fill(150,0,150);
    ellipse(t_collectable.x_pos, t_collectable.y_pos, 
            t_collectable.size + 25, t_collectable.size + 25);
    fill(255,255,0);
    ellipse(t_collectable.x_pos, t_collectable.y_pos, 
            t_collectable.size + 10, t_collectable.size + 10);
    fill(255,25,0);
    ellipse(t_collectable.x_pos, t_collectable.y_pos, 
            t_collectable.size -5, t_collectable.size -5);

    // Collectable Flicker
    if(frameCount % 20 == 0){
        if(t_collectable.size != 10){
            t_collectable.size = 10;
        } else{
            t_collectable.size = 6;
        }
    }
    noStroke();
}

// Function to check character has collected an item.
function checkCollectable(t_collectable){
    if(dist(gameChar_world_x, gameChar_y,
       t_collectable.x_pos, t_collectable.y_pos + 10) < 40){

        // Play Sound
        if(collectableSNDNdx < collectableSNDS.length - 1){
            collectableSNDS[collectableSNDNdx].play();
            collectableSNDNdx += 1;
        }else{
            collectableSNDS[collectableSNDNdx].play();
            collectableSNDNdx = 0;
        }

        t_collectable.isFound = true;
        game_score += 1;
    } 
}

// ----------------------------------
// Flag render and check functions
// ----------------------------------

function renderFlagpole(){
    push();
    
    // Shadow
    fill(0,0,0,30);
    ellipse(flagpole.x_pos, floorPos_y + 35, 75, 15);
    
    // Flag Pole
    strokeWeight(5);
    stroke(100);
    line(flagpole.x_pos - 2.5, floorPos_y +30, flagpole.x_pos - 2.5, floorPos_y - 250);
    stroke(150);
    line(flagpole.x_pos + 2.5, floorPos_y +30, flagpole.x_pos + 2.5, floorPos_y - 250);
    
    // Flag Pole Top
    noStroke();
    fill(255, 255, 50);
    ellipse(flagpole.x_pos, floorPos_y - 250, 15, 15);
    
    // Flag
    if(flagpole.isReached){
        fill(255, 0, 0);
        rect(flagpole.x_pos, floorPos_y - 240, 60, 50);  

        fill(139, 0, 0);
        rect(flagpole.x_pos, floorPos_y - 240, 10, 50);  
        
        // Happy Face
        fill(255, 255, 50);
        ellipse(flagpole.x_pos + 35, floorPos_y - 215, 30, 30);
        
        // Eyes & Mouth
        fill(0, 0, 0);
        ellipse(flagpole.x_pos + 30, floorPos_y - 220, 5, 5);
        ellipse(flagpole.x_pos + 40, floorPos_y - 220, 5, 5);
        triangle(flagpole.x_pos + 25, floorPos_y - 215, 
                flagpole.x_pos + 45, floorPos_y - 215, 
                flagpole.x_pos + 35, floorPos_y - 205);
        
    }else{
        fill(255, 0, 0);
        rect(flagpole.x_pos, floorPos_y - 50, 15, 40); 

        fill(139, 0, 0);
        rect(flagpole.x_pos, floorPos_y - 50, 7.5, 50); 
    }
    pop();
}

function checkFlagpole(){
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 15){
        levelCompleteSND.play();
        
        flagpole.isReached = true;
    }
}

// >--------------------------------<
//        Death check function
// >--------------------------------<

function CharDie(){
    lives -= 1;

    if(lives >= 1){
        startGame();   
    } else{ // Game Over
        lives = 0;

        // Stop BGM
        bgmSND.stop();
        bgmIsLooping = false; 
    }
}

// >--------------------------------<
//          Create platform 
// >--------------------------------<

function createPlatforms(x, y, length){
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function(){
            // Platform shadow
            fill(0,0,0,30);
            rect(this.x, floorPos_y + 35, this.length, 15);

            // Platform base
            fill(255, 215, 0);
            rect(this.x, this.y - 10, this.length, 20);
            fill(218, 165, 32);
            rect(this.x, this.y + 10, this.length, 30);
            
            // Platform wires
            fill(165, 100, 42);
            rect(this.x, this.y - 400, 5, 400);
            rect(this.x + this.length -5, this.y - 400, 5, 400);
        },
        checkContact: function(gc_x, gc_y){
            if(gc_x > this.x - 5 && gc_x < this.x + this.length + 5){
                
                var d = this.y - gc_y;
                if(d >= 0 && d < 5){
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

// >--------------------------------<
//         Enemy constructors
// >--------------------------------<

function Enemy(x, y, range, moveHorizontal = true, shadowYPos){
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.currentY = y;
    this.inc = 1;
    
    this.update = function(){
        if(moveHorizontal){ // Horizontal Movement
            this.currentX += this.inc;

            if(this.currentX >= this.x + this.range){
                this.inc = -1;
            }else if (this.currentX < this.x){
                this.inc = 1;
            }
        }else{ // Vertical Movement
            this.y += this.inc;
            
            if(this.y >= this.currentY + this.range){
                this.inc = -1;
            }else if (this.y < this.currentY){
                this.inc = 1;
            }
        }
    }
    
    this.draw = function(){
        this.update(); 

        // Shadow
        if(shadowYPos != 0){
            fill(0,0,0,30);
            ellipse(this.currentX, floorPos_y + shadowYPos, 25, 15);
        }
            
        stroke(0);
        
        // Spikes
        fill(255,255,0);
        triangle(this.currentX, this.y -20, 
                 this.currentX - 5, this.y -10, 
                 this.currentX + 5, this.y -10);
        
        triangle(this.currentX, this.y +20, 
                 this.currentX - 5, this.y +10, 
                 this.currentX + 5, this.y +10);
        
        triangle(this.currentX -20, this.y - 2.5, 
                 this.currentX -10, this.y - 7.5, 
                 this.currentX -10, this.y + 5);
        
        triangle(this.currentX +20, this.y - 2.5, 
                 this.currentX +10, this.y - 7.5, 
                 this.currentX +10, this.y + 5);
        
        // Body Flicker (red circle)
        fill(255,0,0);
        if(frameCount % 5 == 0 || frameCount % 5 == 2){
            ellipse(this.currentX, this.y, 35, 35);
        }else{
            ellipse(this.currentX, this.y, 25, 25);
        }

        // Body (blue circle)
        fill(0,0,255);
        ellipse(this.currentX, this.y, 10, 10);
        
        noStroke();
    }
    
    this.checkContact = function(gc_x, gc_y){
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        
        if(d < 25){
            if(!gamePaused){
                if(lives <= 1){
                    gameOverSND.play(); 
                }else{
                    damageSND.play();
                }    
            }
            return true;
        }
        return false;
    }
}