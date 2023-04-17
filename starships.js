//Variables
var users = { p: 'testuser' }
var currnet_user = null;
var records = {};//{user_name:score}
var score = 0;
var TIME_INTERVAL = 100;
var INITIAL_GAME_TIME = 120;
var game_started = false;
var lineWidth;
var ROWS = 4
var timeLeft;
var target1;
var target2;
var target3;
var target4;
var enemyballOnScreen;
var intervalTimer;
var COLUMN = 5;
var canvasWidth;
var canvasHeight;
var cannonBaseRadius;
var cannonLength;
var cannonballRadius;
var cannonballSpeed;
var targetDistance;
var targetBeginning;
var targetEnd;
var pieceLength;
var initialTargetVelocity;
var barrelEnd;
var ship;
var SHOT=32;
var myShot;
var SHOT_RADIUS = 10;
var cannonballOnScreen=false;

var TARGET_PIECES = ROWS * COLUMN;//number of enemy ships

// function that is called when the user click on the sign in button
function sign_in_click() {

    document.getElementById("welcome_page").style.display = "none";
    document.getElementById("sign-in").style.display = "block";
}
// function that is called when the user click on the sign up button
function sign_up_click() {
    var x = document.getElementById("welcome_page");
    x.style.display = "none";
    document.getElementById("sign-up").style.display = "block";
}
// checking if the user name and password are correct
function sign_in_check() {
    var user_name = document.getElementById("username1").value;
    var password = document.getElementById("password-in").value;
    var my_password = users[user_name];
    if (my_password == password) {
        currnet_user = user_name;
        document.getElementById("sign-in").style.display = "none";
        start();//move to the game
    }
    else {
        alert("wrong user name or password");
    }
}
// checking if the user name is already exists and if not, add it to the users dictionary
function sign_up_check() {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    var user_name = document.getElementById("username2").value;
    var password = document.getElementById("password-up").value;
    var confirm_password = document.getElementById("psw-repeat").value;
    console.log(user_name, password, confirm_password)
    var email = document.getElementById("email").value;
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (password == confirm_password) {
        if (!(user_name in users)) {
            if (regex.test(password) == true) {
                if (email_regex.test(email) == false) {
                    alert("email is not valid");
                } else {
                    users[user_name] = password;
                    document.getElementById("sign-up").style.display = "none";
                    start();//move to the game
                }
            }
            else {
                alert("password must be at least 8 characters long, and must contain at least one number and one letter.");
            }
        }
        else {
            alert("user name already exists");
        }

    }

}
// function that is called when the user click on back button
function back_to_welcome() {
    document.getElementById("welcome_page").style.display = "block";
    document.getElementById("sign-in").style.display = "none";
    document.getElementById("sign-up").style.display = "none";
}
function start() {
    game_started = true;
    document.getElementById("game").style.display = "block";

}
function setupGame() {
    document.getElementById("canvas").style.display = "block";

    // stop timer if document unload event occurs
    //    document.addEventListener("unload", stopTimer, false );

    // get the canvas, its context and setup its click event handler
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    // start a new game when user clicks Start Game button
    document.getElementById("start").addEventListener(
        "click", newGame, false);

    // JavaScript Object representing game items
    target1 = new Object(); // object representing target line
    target1.start = new Object(); // will hold x-y coords of line start
    target1.end = new Object(); // will hold x-y coords of line end
    target2 = new Object(); // object representing target line
    target2.start = new Object(); // will hold x-y coords of line start
    target2.end = new Object(); // will hold x-y coords of line end
    target3 = new Object(); // object representing target line
    target3.start = new Object(); // will hold x-y coords of line start
    target3.end = new Object(); // will hold x-y coords of line end
    target4 = new Object(); // object representing target line
    target4.start = new Object(); // will hold x-y coords of line start
    target4.end = new Object(); // will hold x-y coords of line end
    shipball = new Object(); // object representing cannonball point
    barrelEnd = new Object(); // object representing end of cannon barrel
    ship = new Object();
    myShot=new Object();
    const randomX = Math.floor(Math.random() * (canvas.width-60));
    const centerY = canvas.height - 40;
    ship.x = randomX;
    ship.y = centerY;
    // initialize hitStates as an array
    hitStates = new Array(ROWS);
    for (var i = 0; i < hitStates.length; i++) {
        hitStates[i] = new Array(COLUMN);
    }


    // get sounds
    targetSound = document.getElementById("targetSound");
    ship_gun_sound = document.getElementById("ship_gun_sound");
    enemy_gun_sound = document.getElementById("enemy_gun_sound");

    

    // interval=setInterval(UpdatePosition, TIME_INTERVAL);
} // end function setupGame


function GetKeyPressed() {
    if (keysDown[38]) {
        return 1;
    }
    if (keysDown[40]) { 
        return 2;
    }
    if (keysDown[37]) { 
        return 3;
    }
    if (keysDown[39]) { 
        return 4;
    }
    if(keysDown[32]){
        return 5;
    }
}
function startTimer() {
    
    intervalTimer = window.setInterval(UpdatePosition, TIME_INTERVAL);
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
        
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);

} // end function startTimer

// terminate interval timer
function stopTimer() {
    canvas.removeEventListener("keyup", function(event){if (event.key === 'Space'){
        ShipShot();
    }}, false);
    window.clearInterval(intervalTimer);
} // end function stopTimer

// called by function newGame to scale the size of the game elements
// relative to the size of the canvas before the game begins
function resetElements() {
    var w = canvas.width;
    var h = canvas.height;
    canvasWidth = w; // store the width
    canvasHeight = h; // store the height
    cannonBaseRadius = h / 18; // cannon base radius 1/18 canvas height
    cannonLength = w / 8; // cannon length 1/8 canvas width

    cannonballRadius = w / 36; // cannonball radius 1/36 canvas width
    cannonballSpeed = w / 2; // cannonball speed multiplier

    // configure instance variables related to the target
    targetDistance = w * 7 / 8; // target 7/8 canvas width from left
    targetBeginning = h / 8; // distance from top 1/8 canvas height
    targetEnd = h * 7 / 8; // distance from top 7/8 canvas height
    pieceLength = (targetEnd - targetBeginning) / TARGET_PIECES;
    initialTargetVelocity = -h / 4; // initial target speed multiplier
    target1.start.x = targetDistance;
    target1.start.y = targetBeginning;
    target1.end.x = targetDistance;
    target1.end.y = targetEnd;

    // end point of the cannon's barrel initially points horizontally
    barrelEnd.x = cannonLength;
    barrelEnd.y = h / 2;
} // end function resetElements

function newGame() {
    resetElements(); // reinitialize all game elements
    //    stopTimer(); // terminate previous interval timer

    // set every element of hitStates to false--restores target pieces
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLUMN; j++) {
            hitStates[i][j] = new Object();
            hitStates[i][j].hit = false; // target piece not destroyed
            // hitStates[i][j].x=null;
            // hitStates[i][j].y=null;
        }
    }
    draw();

    targetPiecesHit = 0; // no target pieces have been hit
    targetVelocity = initialTargetVelocity; // set initial velocity
    timeLeft = INITIAL_GAME_TIME; // start the countdown at 10 seconds
    timerCount = 0; // the timer has fired 0 times so far
    enemyballOnScreen = false; // the enemyball is not on the screen
    shotsFired = 0; // set the initial number of shots fired
    timeElapsed = 0; // set the time elapsed to zero
    startTimer()
        // startTimer(); // starts the game loop
} // end function newGame
function draw(){
    canvas.width = canvas.width; // clears the canvas (from W3C docs)
    if (cannonballOnScreen) {
        context.fillStyle = "red";
        context.beginPath();
        context.arc(myShot.x,myShot.y,SHOT_RADIUS,0,Math.PI *2);
        // context.closePath();
        context.fill();
    }
    context.strokeStyle="black";
    context.lineWidth=2;
    context.strokeRect(0,0,canvas.width,canvas.height);
   // display time remaining
   context.fillStyle = "black";
   context.font = "bold 24px serif";
   context.textBaseline = "top";
   context.fillText("Time remaining: " + timeLeft, 5, 5);


   const Myradius = 30;
   context.beginPath();
   context.arc( ship.x,  ship.y, Myradius, 0, 2 * Math.PI);
   context.fillStyle = 'grey';
   context.fill();

const radius = 20;
const spacing = 40;
const startX = (canvas.width - (COLUMN * (2 * radius + spacing))) / 2;
const startY = 50;

for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLUMN; j++) {
    if(!hitStates[i][j].hit){
    
    const x = startX + radius + j * (2 * radius + spacing);
    const y = startY + radius + i * (2 * radius + spacing);
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    hitStates[i][j].x=x;
    hitStates[i][j].y=y;
    if(i===0)
        context.fillStyle = 'blue';
    if(i===1)
        context.fillStyle = 'yellow';
    if(i===2)
        context.fillStyle = 'red';
    if(i===3)
        context.fillStyle = 'green'; 
    context.fill();   
  }
}
}

}
function UpdatePosition() {
    var x = GetKeyPressed()
    if(x==1)//up
    {
        if(ship.y>=520)
        {
            ship.y=ship.y-60;
        }
    }
    if(x==2)//down
    {
        if(ship.y<=600)
        {
            ship.y+=60;
        }
    }
    if(x==3)//left
    {
        if(ship.x>110)
        {
            ship.x-=80;
        }
        else if(ship.x<110 && ship.x>40){
            ship.x=40
        }
    }
    if(x==4)//right
    {
        if(ship.x<=880)
        {
            ship.x+=80;
        }
        if(ship.x>880){
            ship.x=960;
        }
    }
    if(x==5){
        if(!cannonballOnScreen){
            ShipShot(); 
        }

     
       

    }//Myship shooting

    var to_brake=false;
    if(cannonballOnScreen){
        var interval = TIME_INTERVAL /1000.0;
        myShot.y += interval * cannonballVelocityY;
        for (var i=0;i<ROWS;i++){
            for (var j=0;j<COLUMN;j++){
                if(hitStates[i][j].hit==false){
                    if(myShot.x >= hitStates[i][j].x-20 && myShot.x <= hitStates[i][j].x+20 && 
                        myShot.y >= hitStates[i][j].y-20 && myShot.y <= hitStates[i][j].y+20 ){
                            hitStates[i][j].hit=true;
                            cannonballOnScreen=false;
                            break;
                            to_brake=true;
                        }
                    }
                        
                }
                if(to_brake){
                    break;
                }
            }
        }
        if (myShot.y - SHOT_RADIUS < 0)//check collision with top wall
        {
            cannonballOnScreen = false;
        }  
    
    
    draw();    
}
function ShipShot(){
    // if (cannonballOnScreen) // if a cannonball is already on the screen
    // return; // do nothing

 // move the cannonball to be inside the cannon

 myShot.x = ship.x;
 myShot.y = ship.y;

 // get the x component of the total velocity
 // get the y component of the total velocity
 cannonballVelocityY = (-cannonballSpeed);
 cannonballOnScreen = true; // the cannonball is on the screen
//  ++shotsFired; // increment shotsFired

 // play cannon fired sound
//  cannonSound.play();
}


window.addEventListener("load", setupGame, false);
// window.addEventListener("keydown", UpdatePosition, false);


