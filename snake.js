// Canvas variables n functions.
let gameCanvas, gameCanvasContext;
let cellSize = 30, cols = 15, rows = 15; // cols & rows must be odd nums.

function setHabitatSize(size){
	// Default size
    if (size.id == "setHabitatSize0"){
        cols = 15, rows = 15;
        cellSize = 450 / 15;
        document.documentElement.style.setProperty("--canvas-background-size", "60px 60px");
        document.documentElement.style.setProperty("--canvas-background-position", "0 0, 30px 0, 30px -30px, 0px 30px");
        snakeHeadPosX = 7 * cellSize;
        snakeHeadPosY = 3 * cellSize;
        cherryPosX = 7 * cellSize;
        cherryPosY = 11 * cellSize;
    } // Small size
    else if (size.id == "setHabitatSize1"){
        cols = 9, rows = 9;
        cellSize = 450 / 9;
        document.documentElement.style.setProperty("--canvas-background-size", "100px 100px"); // Double the cell size
        document.documentElement.style.setProperty("--canvas-background-position", "0 0, 50px 0, 50px -50px, 0px 50px"); // Cell size
        snakeHeadPosX = 4 * cellSize;
        snakeHeadPosY = 2 * cellSize;
        cherryPosX = 4 * cellSize;
        cherryPosY = 6 * cellSize;
    } // Big size
    else if (size.id =="setHabitatSize2"){
        cols = 25; rows = 25;
        cellSize = 450 / 25;
        document.documentElement.style.setProperty("--canvas-background-size", "36px 36px");
        document.documentElement.style.setProperty("--canvas-background-position", "0 0, 18px 0, 18px -18px, 0px 18px");
        snakeHeadPosX = 12 * cellSize;
        snakeHeadPosY = 7 * cellSize;
        cherryPosX = 12 * cellSize;
        cherryPosY = 17 * cellSize;
    }
    
    DEFAULTsnakeHeadPosX = snakeHeadPosX;
    DEFAULTsnakeHeadPosY = snakeHeadPosY;
    DEFAULTcherryPosX = cherryPosX;
    DEFAULTcherryPosY = cherryPosY;
    
    drawSprites();
    drawMenuScreen();
}

// Game variables n functions.
let gameOver = false;
let gameLoopRunning = false;
let keyLag;
let gameLoopId;

// Snake variables n functions. //////////////////////////
let snakeHeadPosX = 7 * cellSize, snakeHeadPosY = 3 * cellSize;
let DEFAULTsnakeHeadPosX = snakeHeadPosX;
let DEFAULTsnakeHeadPosY = snakeHeadPosY;
let snakeMoveHeadPosX = 0, snakeMoveHeadPosY = 0;
let snakeBody = [];
let snakeSpeed = 9; // Default: 9, Slow: 6, Fast: 14
let snakeColor = "lime";

function setSnakeColor(color){
	if (color.id == "setSnakeColor0")
		snakeColor = "lime";
	else if (color.id == "setSnakeColor1")
		snakeColor = "#fcbaba";
	else if (color.id == "setSnakeColor2")
		snakeColor = "#c89e51";
	
	drawSprites();
	drawMenuScreen();
}

function setSnakeSpeed(speed){
	if (speed.id == "setSnakeSpeed0")
		snakeSpeed = 8;
	else if (speed.id == "setSnakeSpeed1")
		snakeSpeed = 5;
	else if (speed.id == "setSnakeSpeed2")
		snakeSpeed = 14;
}

function snakeDir(key){
	if (key.code == "ArrowUp" && gameLoopRunning && snakeMoveHeadPosY != 1 && !keyLag){
		snakeMoveHeadPosX = 0;
		snakeMoveHeadPosY = -1;
	}
	else if (key.code == "ArrowDown" && gameLoopRunning && snakeMoveHeadPosY != -1 && !keyLag){
		snakeMoveHeadPosX = 0;
		snakeMoveHeadPosY = 1;
	}
	else if (key.code == "ArrowLeft" && gameLoopRunning && snakeMoveHeadPosX != 1 && !keyLag){
		snakeMoveHeadPosX = -1;
		snakeMoveHeadPosY = 0;
	}
	else if (key.code == "ArrowRight" && gameLoopRunning && snakeMoveHeadPosX != -1 && !keyLag){
		snakeMoveHeadPosX = 1;
		snakeMoveHeadPosY = 0;
	}
	keyLag = true;
}

function snakeMove() {
	for (let i = snakeBody.length - 1; i > 0; i--)
		snakeBody[i] = snakeBody[i - 1];
	if (snakeBody.length)
		snakeBody[0] = [snakeHeadPosX, snakeHeadPosY];
	snakeHeadPosX += snakeMoveHeadPosX * cellSize;
	snakeHeadPosY += snakeMoveHeadPosY * cellSize;
}

// Cherry variables n functions. ////////////////////////////
let cherryPosX = 7 * cellSize, cherryPosY = 11 * cellSize;
let DEFAULTcherryPosX = cherryPosX;
let DEFAULTcherryPosY = cherryPosY;
let cherryColor = "red";

// When window loads
window.onload = function (){
	gameCanvas = document.getElementById("gameCanvas");
	gameCanvasContext = gameCanvas.getContext("2d");

	gameMenu = document.getElementById("gameMenu");
	gameSettings = document.getElementById("gameSettings");
	document.addEventListener("keydown", snakeDir);

	drawSprites();
	drawMenuScreen();
}

function runGameLoop(){
	gameLoopRunning = true;
	gameMenu.style.display = "none";
	gameSettings.style.display = "none";
	gameCanvasContext.globalAlpha = 1;

	gameLoopId = setInterval(gameLoop, 1000/snakeSpeed); // FPS
}

function gameLoop(){
	keyLag = false;
	snakeMove();
	checkCollisions();
	if (gameOver){
		gameOver = false;
		gameLoopRunning = false;
		clearInterval(gameLoopId);
		returnToMenuScreen();
		return;
	}
	drawSprites();
}

function showSettings(){
	if (gameSettings.style.display == "none"){
		gameSettings.style.display = "block";
	}
	else {
		gameSettings.style.display = "none";
	}
}

function checkCollisions() {
	// Check snake collision with wall
	if (snakeHeadPosX < 0 || snakeHeadPosY < 0 || snakeHeadPosX >= gameCanvas.width || snakeHeadPosY >= gameCanvas.height)
		gameOver = true;

	// Check snake collision with snake body
	for (let i = 0; i < snakeBody.length; i++)
		if (snakeHeadPosX == snakeBody[i][0] && snakeHeadPosY == snakeBody[i][1])
			gameOver = true;

	// Check snake collision with cherry
	if (snakeHeadPosX == cherryPosX && snakeHeadPosY == cherryPosY){
		snakeBody.push([cherryPosX, cherryPosY]);
		cherryPosX = Math.floor(Math.random() * cols) * cellSize;
		cherryPosY = Math.floor(Math.random() * rows) * cellSize;
	}
}

function returnToMenuScreen() {
	// Return snake to default variables
	snakeHeadPosX = DEFAULTsnakeHeadPosX, snakeHeadPosY = DEFAULTsnakeHeadPosY;
	snakeMoveHeadPosX = 0, snakeMoveHeadPosY = 0;
	snakeBody = [];

	// Return cherry to default variables
	cherryPosX = DEFAULTcherryPosX, cherryPosY = DEFAULTcherryPosY;

	// Draw menu screen
	drawSprites();
	drawMenuScreen();

	gameMenu.style.display = "block";
	gameSettings.style.display = "none";
}

function drawMenuScreen() {
	gameCanvasContext.globalAlpha = 0.5;
	gameCanvasContext.fillStyle = "black";
	gameCanvasContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawSprites(){
	// Clear gameCanvas
	gameCanvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	gameCanvasContext.globalAlpha = 1;

	// Draw cherry
	gameCanvasContext.fillStyle = cherryColor;
	gameCanvasContext.fillRect(cherryPosX, cherryPosY, cellSize, cellSize);

	// Draw snake head
	gameCanvasContext.fillStyle = snakeColor;
	gameCanvasContext.fillRect(snakeHeadPosX, snakeHeadPosY, cellSize, cellSize);

	// Draw snake body
	if (snakeBody)
		for (let i = 0; i < snakeBody.length; i++)
			gameCanvasContext.fillRect(snakeBody[i][0], snakeBody[i][1], cellSize, cellSize);
}