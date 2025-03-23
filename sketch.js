/*
	part5 multiple interactables
*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var collectables;
var canyons;

var treePos_y;
var treePos_x;

var cloud;
var mountain;

var cameraPosX;

var gameScore = 0;
var flagpole = {
    x_pos: 1500,
    isReached: false
};

var lives = 3;

var backgroundMusic, jumpSound, collectSound, dieSound, winSound, walkSound;
var isWalking = false;

var platforms = [];
var enemies = [];

function preload() {
    soundFormats('mp3');
    backgroundMusic = loadSound('assets/Background.mp3');
    jumpSound = loadSound('assets/jump.mp3');
    collectSound = loadSound('assets/coin.mp3');
    dieSound = loadSound('assets/die.mp3');
    winSound = loadSound('assets/win.mp3');
    walkSound = loadSound('assets/walk.mp3');
}

function setup() {
    createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    
    backgroundMusic.setVolume(0.3);
    jumpSound.setVolume(0.5);
    collectSound.setVolume(0.7);
    walkSound.setVolume(0.4);
    
    backgroundMusic.loop();
    startGame();
}

function startGame() {
    gameChar_x = width/2;
    gameChar_y = floorPos_y;

    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    // Updated collectables positioned on platforms
    collectables = [
        {x_pos: 350, y_pos: floorPos_y - 110, size: 20, isFound: false},
        {x_pos: 625, y_pos: floorPos_y - 140, size: 20, isFound: false},
        {x_pos: 990, y_pos: floorPos_y - 90, size: 20, isFound: false}
    ];

    // Revised canyon positions
    canyons = [
        {x_pos: 250, width: 150},  // First challenge canyon
        {x_pos: 550, width: 200},  // Main wide canyon
        {x_pos: 900, width: 120}   // Final canyon before flagpole
    ];

    treePos_x = [100, 300, 500, 700, 900, 1100];
    treePos_y = height/2;

    cloud = [
        {x: 200, y: 100},
        {x: 400, y: 150},
        {x: 900, y: 150},
        {x: 1500, y: 100},
        {x: 600, y: 120}
    ];

    mountain = [
        {x: 150, y: 100},
        {x: 450, y: 120},
        {x: 850, y: 100},
        {x: 1200, y: 120},
        {x: 750, y: 90}
    ];

    // Strategic platform placement
    platforms = [
        createPlatform(250, floorPos_y - 70, 200),  // Covers first canyon
        createPlatform(550, floorPos_y - 120, 150),  // Covers second canyon
        createPlatform(1000, floorPos_y - 65, 180)    // Final platform
    ];

    // Enemies placed between obstacles
    enemies = [
        new Enemy(50, floorPos_y - 15, 100),  // After first platform
        new Enemy(770, floorPos_y - 15, 150), // Between second and third canyon
        new Enemy(1100, floorPos_y - 15, 100) // Final challenge
    ];

    cameraPosX = 0;
    gameScore = 0;
    flagpole.isReached = false;
}

function draw()
{

	///////////DRAWING CODE//////////

	cameraPosX = gameChar_x - width/2; // Set the camera to follow the character

	background(100,155,255); //fill the sky blue


	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
	
	// Scroll the background
    push();
    translate(-cameraPosX, 0);

    // Draw mountains
    drawMountains();

    // Draw trees
    drawTrees();

    // Draw clouds
    drawClouds();

    // Draw collectable items
    for (var i = 0; i < collectables.length; i++) {
        drawCollectable(collectables[i]);
        checkCollectable(collectables[i]);
    }

    // Draw canyons
    for (var i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

	// Draw platforms
	push();
	for(let i = 0; i < platforms.length; i++) {
		platforms[i].draw();
	}
	pop();
	
	// Draw enemies
	push();
    for(let i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }
	pop();

    // Enemy collision check
    for(let i = 0; i < enemies.length; i++) {
        if(enemies[i].checkContact(gameChar_x, gameChar_y)) {
            lives--;
            dieSound.play();
            if(lives > 0) {
                startGame();
            }
            break;
        }
    }
	
	drawFlagpole();
	if (!flagpole.isReached) {
		checkFlagpole();
	}

	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		fill(107,142,35);
		ellipse(gameChar_x, gameChar_y-23, 36, 46);

		fill(255,160,122);
		ellipse(gameChar_x, gameChar_y-46, 15, 22);
		fill(0);
		arc(gameChar_x, gameChar_y-49, 15, 10, HALF_PI, PI);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		fill(107,142,35);
		ellipse(gameChar_x, gameChar_y-23, 36, 46);

		fill(255,160,122);
		ellipse(gameChar_x, gameChar_y-46, 15, 22);
		fill(0);
		arc(gameChar_x, gameChar_y-49, 15, 10, 0, HALF_PI);

	}
	else if(isLeft)
	{
		// add your walking left code
		fill(107,142,35);
		ellipse(gameChar_x, gameChar_y-20, 40, 40);

		fill(255,160,122);
		ellipse(gameChar_x, gameChar_y-42, 18, 18);
		fill(0);
		arc(gameChar_x, gameChar_y-45, 18, 10, HALF_PI,PI);

	}
	else if(isRight)
	{
		// add your walking right code
		fill(107,142,35);
		ellipse(gameChar_x, gameChar_y-20, 40, 40);

		fill(255,160,122);
		ellipse(gameChar_x, gameChar_y-42, 18, 18);
		fill(0);
		arc(gameChar_x, gameChar_y-45, 18, 10, 0,HALF_PI);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		fill(107,142,35);
		ellipse(gameChar_x, gameChar_y-23, 36, 46);

		fill(255,160,122);
		ellipse(gameChar_x, gameChar_y-46, 15, 22);
		fill(0);
		arc(gameChar_x, gameChar_y-49, 15, 10, 0, HALF_PI + HALF_PI);

	}
	else
	{
		// add your standing front facing code
		fill(107,142,35);
		ellipse(gameChar_x, gameChar_y-20, 40, 40);

		fill(255,160,122);
		ellipse(gameChar_x, gameChar_y-42, 18, 18);
		fill(0);
		arc(gameChar_x, gameChar_y-45, 18, 10, 0, HALF_PI + HALF_PI);

	}

	pop();

	if (flagpole.isReached) {
		fill(0, 255, 0);
		textSize(64);
		textAlign(CENTER, CENTER);
		text("LEVEL COMPLETE", width/2, height/2);
		return;
	}

	if (lives <= 0) {
		fill(255, 0, 0);
		textSize(64);
		textAlign(CENTER, CENTER);
		text("GAME OVER", width/2, height/2);
		drawLives();
		return;
	}
	
	///////////INTERACTION CODE//////////
    if (lives > 0 && !flagpole.isReached) {
		if (isLeft) gameChar_x -= 5;
		if (isRight) gameChar_x += 5;
		
		// gravity
		let onPlatform = false;
		for(let i = 0; i < platforms.length; i++) {
			if(platforms[i].checkContact(gameChar_x, gameChar_y)) {
				onPlatform = true;
				break;
			}
		}

		if(!onPlatform && gameChar_y < floorPos_y) {
			gameChar_y += 2;
			isFalling = true;
		} else if(onPlatform) {
			isFalling = false;
			gameChar_y = platforms.find(p => p.checkContact(gameChar_x, gameChar_y)).y - 2;
		} else {
			isFalling = false;
		}
	}

	fill(255);
	noStroke();
	textSize(24);
	text("Score: " + gameScore, 20, 40);
	drawLives();
    checkPlayerDie();
}


function keyPressed()
{
	if (lives <= 0 || flagpole.isReached) return;
    if (isPlummeting) return;

    if (key === 'a' ) {
        isLeft = true;
		if (!isFalling) {
            walkSound.loop();
            isWalking = true;
        }
    } else if (key === 'd' ) {
        isRight = true;
		if (!isFalling) {
            walkSound.loop();
            isWalking = true;
        }
    }
    if ((key === 'w' || keyCode === 32) && !isFalling) { 
        gameChar_y -= 100;
        isFalling = true;
		jumpSound.play();
    }
}

function keyReleased()
{
	if (key === 'a') {
        isLeft = false;
		walkSound.stop();
        isWalking = false;
    } else if (key === 'd') {
        isRight = false;
		walkSound.stop();
        isWalking = false;
    }
}

function drawClouds() {
    for (var i = 0; i < cloud.length; i++) {
        fill(255, 255, 255);
        triangle(cloud[i].x-151, cloud[i].y +28, cloud[i].x +151, cloud[i].y +28, cloud[i].x, cloud[i].y);
        ellipse(cloud[i].x-95, cloud[i].y +19, 35, 16);
        ellipse(cloud[i].x+100, cloud[i].y +16, 40, 25);
        ellipse(cloud[i].x-58, cloud[i].y +10, 60, 38);
        ellipse(cloud[i].x+58, cloud[i].y +10, 60, 38);
        ellipse(cloud[i].x-10, cloud[i].y -13, 60, 45);
        ellipse(cloud[i].x+28, cloud[i].y -10, 60, 45);
        ellipse(cloud[i].x+8, cloud[i].y -30, 70, 70);
    }
}

function drawMountains() {
    for (var i = 0; i < mountain.length; i++) {
        fill(7, 77, 42);
        quad(mountain[i].x, floorPos_y, mountain[i].x + 240, floorPos_y, mountain[i].x + 100, mountain[i].y, mountain[i].x + 90, mountain[i].y);
        quad(mountain[i].x + 40, floorPos_y, mountain[i].x + 280, floorPos_y, mountain[i].x + 140, mountain[i].y - 40, mountain[i].x + 130, mountain[i].y - 40);
    }
}

function drawTrees() {
    for (var i = 0; i < treePos_x.length; i++) {
        fill(113, 208, 168);
        triangle(treePos_x[i] - 278, 3 * treePos_y / 2 - 70, treePos_x[i] - 190, 3 * treePos_y / 2 - 70, treePos_x[i] - 234, 3 * treePos_y / 2 - 284);
        fill(36, 55, 95);
        triangle(treePos_x[i] - 239, treePos_y + treePos_y / 2, treePos_x[i] - 229, treePos_y + treePos_y / 2, treePos_x[i] - 234, treePos_y + treePos_y / 2 - 226);
    }
}

function drawCollectable(t_collectable) {
    if (!t_collectable.isFound) {
        fill(0, 255, 0);
        stroke(255, 215, 0);
        strokeWeight(3);
        ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, t_collectable.size);
        noStroke();
    }
}

function checkCollectable(t_collectable) {
    if (dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 40) {
        if (!t_collectable.isFound) {
            gameScore++;
            t_collectable.isFound = true;
            collectSound.play();
        }
    }
}

function drawCanyon(t_canyon) {
    fill(105, 105, 105);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height - floorPos_y);
}

function drawFlagpole() {
    push();
    stroke(150);
    strokeWeight(4);
    line(flagpole.x_pos, floorPos_y - 250, flagpole.x_pos, floorPos_y);
    noStroke();
    fill(flagpole.isReached ? color(255, 0, 0) : color(180));
    rect(flagpole.x_pos, flagpole.isReached ? floorPos_y - 250 : floorPos_y - 50, 40, 30);
    pop();
}

function drawLives() {
    for(let i = 0; i < lives; i++) {
        fill(255, 0, 0);
        ellipse(width - 50 - (i * 40), 40, 30, 30);
    }
}

function checkCanyon(t_canyon) {
    if (gameChar_x > t_canyon.x_pos && gameChar_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y) {
        isPlummeting = true;
    }
    if (isPlummeting) {
        gameChar_y += 2;
    }
	if (isPlummeting) {
        gameChar_y += 2;
        checkPlayerDie(); // ADD THIS LINE
    }
}

function checkFlagpole() {
    if (!flagpole.isReached) {
        let distance = abs(gameChar_x - flagpole.x_pos);
        if (distance < 30) {
            flagpole.isReached = true;
            winSound.play();
            backgroundMusic.stop();
            walkSound.stop();
        }
    }
}

function checkPlayerDie() {
    if (gameChar_y > height) {
        lives--;
        dieSound.play();
        if (lives > 0) {
            startGame();
        } else {
            backgroundMusic.stop();
        }
    }
}

function createPlatform(x, y, length) {
    return {
        x: x,
        y: y,
        length: length,
        
        draw: function() {
            fill(147, 112, 219); // Purple color
            noStroke();
            rect(this.x, this.y, this.length, 20);
        },
        
        checkContact: function(gameChar_x, gameChar_y) {
            const xMatch = gameChar_x > this.x && gameChar_x < this.x + this.length;
            const yMatch = gameChar_y <= this.y && gameChar_y >= this.y - 2;
            return xMatch && yMatch;
        }
    };
}

function Enemy(x, y, range) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.direction = 1;
    this.size = 30;

    this.update = function() {
        this.currentX += this.direction;
        if(this.currentX >= this.x + this.range || this.currentX <= this.x) {
            this.direction *= -1;
        }
    };

    this.draw = function() {
        this.update();
        fill(255, 0, 0); // Red color for danger
        noStroke();
        // Draw spiky triangle
        triangle(
            this.currentX, this.y - this.size/2,
            this.currentX - this.size/2, this.y + this.size/2,
            this.currentX + this.size/2, this.y + this.size/2
        );
    };

    this.checkContact = function(charX, charY) {
        return dist(charX, charY, this.currentX, this.y) < this.size;
    };
}