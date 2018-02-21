var canvas;
var ctx;
//paddles
var xPadding;
var yPadding;
var PHeight;
var PWidth;
var PPy;
var AIPy;
//ball
var bx;
var by;
var bSize;
var bxv;
var byv;
//score
var score1;
var score2;
var stw;

//kbCTRLs
var upPressed = false;
var downPressed = false;
var playerSpeed;
var AISpeed;

function init() {
    "use strict";
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	
	xPadding = canvas.width / 40;
	yPadding = canvas.height / 90;
	
	PHeight = 50;
	PWidth = 8;
	
	PPy = (canvas.height - PHeight) / 2;
	AIPy = (canvas.height - PHeight) / 2;
	
	bSize = 9;
	bx = (canvas.width - bSize) / 2;
	by = (canvas.height - bSize) / 2;
	bxv = 6;
	byv = Math.random() * (3 - (-3)) + (-3);
	
	playerSpeed = 5;
	AISpeed = 3.75;
	
	score1 = score2 = 0;
	stw = 5;
	
	kbCtrl();
	draw();
}
function drawPlayerPaddle() {
	ctx.beginPath();
	ctx.rect(xPadding, PPy, PWidth, PHeight);
	ctx.fillStyle = "#eee";
	ctx.fill();
}
function drawAIPaddle() {
	ctx.beginPath();
	ctx.rect(canvas.width - xPadding - PWidth, AIPy, PWidth, PHeight);
	ctx.fillStyle = "#eee";
	ctx.fill();
}
function AI() {
	if (bx > canvas.width / 3 && bxv > 0) {
		if (by + bSize < AIPy + (PHeight / 2) && AIPy > yPadding) {
			AIPy -= AISpeed;
		} else if (by > AIPy + (PHeight / 2) && AIPy + PHeight < canvas.height - yPadding) {
			AIPy += AISpeed;
		}
	} else if (bx < canvas.width / 2.5) {
		if (AIPy + (PHeight / 2) > canvas.height - canvas.height / 4) {
			AIPy -= AISpeed;
		} else if (AIPy + (PHeight / 2) < canvas.height / 4) {
			AIPy += AISpeed;
		}
	}
}
function drawLine() {
	ctx.setLineDash([10, 10]);
	ctx.beginPath();
	ctx.strokeStyle = '#eee';
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
}
function drawBall() {
	ctx.beginPath();
	ctx.rect(bx, by, bSize, bSize);
	ctx.fillStyle = randomColour();
	ctx.fill();
}
function drawScore() {
	ctx.fillText(score1, 100, 90);
	ctx.fillText(score2, canvas.width - 100, 90);
}
function winCheck() {
	ctx.textAlign = 'center';
	if (score1 >= stw) {
		ctx.fillText('Player wins!', canvas.width / 2, canvas.height / 2);
		alert('Player won. Game is restarting');
		document.location.reload();
	} else if (score2 >= stw) {
		ctx.fillText('AI wins! Player loses.', canvas.width / 2, canvas.height / 2);
		alert('AI won. Game is restarting.');
		document.location.reload();
	}
}
function collisionDetect() {
	if (by < 0 && byv < 0) {
		byv = -byv;
	}
	if (by + bSize > canvas.height && byv > 0) {
		byv = -byv;
	}
	//player x collision
	if (bx < xPadding + PWidth && bx > xPadding && bxv < 0) {
		if (by + bSize > PPy && by < PPy + PHeight) {
			bxv = -bxv;
			if (PPy < by + bSize / 2 && by + bSize / 2 < PPy + PHeight * 0.2) {
				byv = -4;
			} else if (PPy + PHeight * 0.2 < by + bSize / 2 && by + bSize / 2 < PPy + PHeight * 0.4) {
				byv = -2;
			} else if (PPy + PHeight * 0.6 < by + bSize / 2 && by + bSize / 2 < PPy + PHeight * 0.8) {
				byv = 2;
			} else if (PPy + PHeight * 0.8 < by + bSize / 2 && by + bSize / 2 < PPy + PHeight) {
				byv = 4;
			}
		}
	}
	//AI x collision
	if (bx + bSize > canvas.width - xPadding - PWidth && bx + bSize < canvas.width - xPadding) {
		if (by + bSize > AIPy && by < AIPy + PHeight) {
			bxv = -bxv;
		}
		if (AIPy < by + bSize / 2 && by + bSize / 2 < AIPy + PHeight * 0.2) {
			byv = -4;
		} else if (AIPy + PHeight * 0.2 < by + bSize / 2 && by + bSize / 2 < AIPy + PHeight * 0.4) {
			byv = -2;
		} else if (AIPy + PHeight * 0.6 < by + bSize / 2 && by + bSize / 2 < AIPy + PHeight * 0.8) {
			byv = 2;
		} else if (AIPy + PHeight * 0.8 < by + bSize / 2 && by + bSize / 2 < AIPy + PHeight) {
			byv = 4;
		}
	}
}
function bRestart() {
	if (bx < 0) {
		score2 + 1;
		console.log('AI has (' + score2 + ') point(s).');
	}
	if (bx + bSize > canvas.width) {
		score1 + 1;
		console.log('Player has (' + score1 + ') point(s).');
	}
	bx = canvas.width / 2;
	by = canvas.height / 2;
	bxv = -bxv;
	byv = Math.ceil(Math.random() * (4 - (-4)) + (-4));
	while (byv == 0) {
		byv = Math.ceil(Math.random() * (4 - (-4)) + (-4));
		console.log("Rerolling velocity because it hit 0");
	}
}
//Keyboard controls
function kbCtrl() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
}
//Handles key-presses
function keyDownHandler(e) {
	if (e.keyCode == 38 || e.keyCode == 37) {
		upPressed = true;
		console.log("upPressed is true");
	}
	if (e.keyCode == 40 || e.keyCode == 39) {
		downPressed = true;
		console.log("downPressed is true");
	}
}
//Handles key-releases
function keyUpHandler(e) {
	if (e.keyCode == 38 || e.keyCode == 37) {
		upPressed = false;
		console.log("upPressed is false");
	}
	if (e.keyCode == 40 || e.keyCode == 39) {
		downPressed = false;
		console.log("downPressed is false");
	}
}
//kbCtrl end

//Major draw funktion, sørger for at spillet kører
function draw() {
	//clear
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//run other functions
	drawPlayerPaddle();
	drawAIPaddle();
	drawBall();
	drawScore();
	drawLine();
	winCheck();
	AI();
	
	//Keyboard controls
	if (upPressed && PPy - yPadding > 0) {
		PPy -= playerSpeed;
	} else if (downPressed && PPy + PHeight < canvas.height - yPadding) {
		PPy += playerSpeed;
	}
	//move ball
	bx += bxv;
	by += byv;
	
	collisionDetect();
	if(bx < 0 || bx+bSize > canvas.width) {
		bRestart();
	}
	//repeat
	requestAnimationFrame(draw);
}