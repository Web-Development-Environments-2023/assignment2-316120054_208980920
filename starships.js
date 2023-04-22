//Variables
var users = { p: 'testuser' }
var currnet_user = null;
var records = {};//{user_name:score}
var score = 0;
var TIME_INTERVAL = 100;
var INITIAL_GAME_TIME = 10;
var shootBtn= 32;
var Myradius = 30;
var startTime;
var time_elapes = 0;
var counter_update_speed=0;
var game_started = false;
var lineWidth;
var liveRemaining =3;
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
var points=0;
var enemiesVelocity;
var radius = 20;
var enemyShots;
var enemieskilled=0;
var record_history;
var shot_interval;
var speed_enemies_interval;
    // get sounds
var ShipShotSound;

var HittedByEnemy;

var GameMusic;
var youLostMusic;
var youWonMusic;
var shipImg;

var TARGET_PIECES = ROWS * COLUMN;//number of enemy ships

function openDialog() {
    var dialog = document.getElementById("aboutDialog");
    dialog.showModal();
  }
  
  function closeDialog() {
    var dialog = document.getElementById("aboutDialog");
    dialog.close();
  }
  document.addEventListener('DOMContentLoaded', () => {
    const aboutDialog = document.querySelector('#aboutDialog');
  
    aboutDialog.addEventListener('click', (event) => {
      if (event.target === aboutDialog) {
        closeDialog();
      }
    });
});

    

// function that is called when the user click on the sign in button
function sign_in_page() {
    // document.getElementById("after_game").style.display = "none";
    document.getElementById("welcome_page").style.display = "none";
    document.getElementById("sign-in").style.display = "block";

}
// checking if the user name and password are correct
function sign_in_check() {
    var user_name = document.getElementById("username1").value;
    var password = document.getElementById("password-in").value;
    var my_password = users[user_name];
    if (my_password == password) {
        currnet_user = user_name;
        document.getElementById("sign-in").style.display = "none";
        record_history=new Object();
        record_history.name= user_name;
        record_history.records=[];
        document.getElementById("configDiv").style.display = "block";
        applyConfig();
       
    }
    else {
        alert("wrong user name or password");
        document.getElementById("username1").value = "";
        document.getElementById("password-in").value  = "";
 
    }
}
function applyConfig() {

    const shootKey = document.querySelector('#shootKey');
    shootKey.addEventListener('keydown', (event) => {
        if(event.keyCode == 32){
            shootKey.value = 'Space';
            shootBtn = 32;
        }
        else{
            shootKey.value = event.key; 
            shootBtn = event.keyCode;
        }
    });
    INITIAL_GAME_TIME = parseInt(document.querySelector('#duration').value) * 60;
  }
// function that is called when the user click on the sign up button
function sign_up_click() {
    var x = document.getElementById("welcome_page");
    x.style.display = "none";
    document.getElementById("sign-up").style.display = "block";
}


// checking if the user name is already exists and if not, add it to the users dictionary
function sign_up_check() {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    var user_name = document.getElementById("username2").value;
    var password = document.getElementById("password-up").value;
    var confirm_password = document.getElementById("psw-repeat").value;
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
                    record_history=new Object();
                    record_history.name= user_name;
                    record_history.records=[];
                    //start();//move to the game
                    document.getElementById("configDiv").style.display = "block";
                    applyConfig();
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
    GameMusic.pause();
    GameMusic.currentTime = 0;
    document.getElementById("welcome_page").style.display = "block";
    document.getElementById("sign-in").style.display = "none";
    document.getElementById("sign-up").style.display = "none";
    document.getElementById("after_game").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("canvas").style.display = "none";
    const button = document.getElementById("start");
    button.value = "Start";
    resetElements();
    stopTimer()
    
}

  

  
function restart(){
    context.clearRect(0,0,canvas.width,canvas.height); 
    document.getElementById("after_game").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("canvas").style.display = "block";
    const button = document.getElementById("start");
    button.value = "Start";
    start();
}
function start() {
    document.getElementById("configuration").style.display = "block";
 // setupGame();
    // newGame();
}
function setupGame() {

    document.getElementById("configDiv").style.display = "none";
    document.getElementById("canvas").style.display = "block";
    document.getElementById("game").style.display = "block";
    
    shipImg = new Image();
    shipImg.src = "ShipPicture.png";
    // get the canvas, its context and setup its click event handler
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    // start a new game when user clicks Start Game button
    document.getElementById("start").addEventListener(
        "click", newGame, false);

    // JavaScript Object representing game items
    shipball = new Object(); // object representing cannonball point
    barrelEnd = new Object(); // object representing end of cannon barrel
    ship = new Object();
    myShot=new Object();
    enemyShots = [];
    startTime = new Date();
    enemiesVelocity = 10;
    direct = "left";
    generate_ship_location();

    // initialize hitStates as an array
    hitStates = new Array(ROWS);
    for (var i = 0; i < hitStates.length; i++) {
        hitStates[i] = new Array(COLUMN);
    }
    ShipShotSound = document.getElementById("shipshot");

    HittedByEnemy = document.getElementById("hitted_by_enemy");

    GameMusic = document.getElementById("game_music");
    youLostMusic = document.getElementById("youLostMusic");
    youWonMusic = document.getElementById("youWonMusic");
    // interval=setInterval(UpdatePosition, TIME_INTERVAL);
} // end function setupGame
function newGame() {

    resetElements(); // reinitialize all game elements
    stopTimer(); // terminate previous interval timer
    speed_enemies_interval = setInterval(update_speed, 5000);
    shot_interval = setInterval(updateShot,100);
    const spacing = 40;
    const startX = (canvas.width - (COLUMN * (2 * radius + spacing))) / 2;
    const startY = 50;
    GameMusic.play();
    // set every element of hitStates to false--restores target pieces
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLUMN; j++) {
            const x = startX + radius + j * (2 * radius + spacing);
            const y = startY + radius + i * (2 * radius + spacing);
            hitStates[i][j] = new Object();
            hitStates[i][j].hit = false; // target piece not destroyed
            hitStates[i][j].x=x;
            hitStates[i][j].y=y;
        }
    }
    enemyShoot();
    draw();

    targetPiecesHit = 0; // no target pieces have been hit
    targetVelocity = initialTargetVelocity; // set initial velocity
    timeLeft = INITIAL_GAME_TIME; // start the countdown at 10 seconds
    timerCount = 0; // the timer has fired 0 times so far
    enemyballOnScreen = false; // the enemyball is not on the screen
    shotsFired = 0; // set the initial number of shots fired
    timeElapsed = 0; // set the time elapsed to zero
    startTimer();
    
        // startTimer(); // starts the game loop
} // end function newGame

function generate_ship_location(){
    var randomX = Math.floor(Math.random() * (canvas.width-60));
    const centerY = canvas.height - 40;
    if(randomX<40){
        randomX=40;
    }
    ship.x = randomX;
    ship.y = centerY;
}
function update_speed(){
    if(counter_update_speed<4){
    enemiesVelocity=enemiesVelocity*1.5;
    counter_update_speed++;
    }
}
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
    if(keysDown[shootBtn]){
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
    // canvas.removeEventListener("keyup", function(event){if (event.key === 'Space'){
    //     ShipShot();
    // }}, false);
    window.clearInterval(intervalTimer);
    window.clearInterval(shot_interval);
    window.clearInterval(speed_enemies_interval);


} // end function stopTimer

// called by function newGame to scale the size of the game elements
// relative to the size of the canvas before the game begins
function resetElements() {
    context.clearRect(0,0,canvas.width,canvas.height); // clear canvas
    startTime = new Date();
    liveRemaining = 3;
    points = 0;
    enemiesVelocity = 10;
    counter_update_speed = 0;
    cannonballOnScreen=false;
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

    // end point of the cannon's barrel initially points horizontally
    barrelEnd.x = cannonLength;
    barrelEnd.y = h / 2;
} // end function resetElements



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
   var time_remained = (INITIAL_GAME_TIME- time_elapes).toFixed(0);
   if(time_remained<0){
        time_remained=0;
   }
   context.fillText("Time remaining: " + time_remained, 5, 5);

      // display points 
    context.fillText("Score: " + points, 5, 25);

    // display live
    context.fillText('Lives: '+ liveRemaining,300,5)
// display enemy shots
    drawShots();

   context.drawImage(shipImg,ship.x,ship.y,60,60);
//    context.beginPath();
//    context.arc( ship.x,  ship.y, Myradius, 0, 2 * Math.PI);
//    context.fillStyle = 'grey';
//    context.fill();

    const button = document.getElementById("start");
    button.value = "Restart";
for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLUMN; j++) {
    if(!hitStates[i][j].hit){
        context.beginPath();
    context.arc(hitStates[i][j].x,hitStates[i][j].y, radius, 0, 2 * Math.PI);

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
function updateLeaderboard() {
    // assume scores and names are retrieved from a database or other data source
    try{

        const container = document.querySelector('#after_game');
        const table = container.querySelector('table');
        table.remove();
    }
    catch{

    }
    let table = document.createElement('table');
    table.style.margin = 'auto';
    table.style.borderCollapse='collapse';
    table.style.border = '2px solid black';
    table.style.fontSize = '5vh';
    table.style.width = '60%';
    table.style.height = '30vh';
    table.style.color = 'black';
    let headerRow = document.createElement('thead');
    let headerCells = ['Rank', 'Score'];
    // Create header cells and add them to the header row
    for (let i = 0; i < headerCells.length; i++) {
      let cell = document.createElement('th');
    //   cell.style.fontWeight = 'bold';
    //   cell.style.textDecoration = 'underline';
      cell.style.borderBottom = '5px solid ';

      cell.innerHTML = headerCells[i];
      headerRow.appendChild(cell);
    }
    table.appendChild(headerRow);

    // Add the header row to the table
    let dataRows = record_history.records;
    dataRows.sort(function(a, b) {
        return b-a;
      });
    for (let i = 0; i < dataRows.length; i++) {
      let row = document.createElement('tr');
      row.style.borderTop = '2px solid';

      let cell1 = document.createElement('td');
      cell1.innerHTML = dataRows[i].toString();
      let cell2 = document.createElement('td');
      cell2.innerHTML =(i+1).toString();
      row.appendChild(cell2);
      row.appendChild(cell1);
      table.appendChild(row);
    }
    
    let container = document.querySelector('#after_game');
    container.appendChild(table);

}


function updateShot(){
    for(var i=0;i<enemyShots.length;i++){
        var interval = 100 /1000.0;
        enemyShots[i].y += 40;
        if(enemyShots[i].y + radius >= canvas.height){
            enemyShots.splice(i,1);
        }
        if(enemyShots[i].y>=canvas.height*(3/4)){
            enemyShoot();
        }
        if(enemyShots[i].x>=ship.x-Myradius && enemyShots[i].x<=ship.x+Myradius
            && enemyShots[i].y>=ship.y-Myradius && enemyShots[i].y<=ship.y+Myradius){
                enemyShots.splice(i,1);
                liveRemaining--;
                HittedByEnemy.currentTime = 0;
                HittedByEnemy.play();
                generate_ship_location();
                
        }
    
    }
}
function drawShots(){
        for (var i=0;i<enemyShots.length;i++){
            
            context.fillStyle = "black";
            context.beginPath();
            context.arc(enemyShots[i].x, enemyShots[i].y, SHOT_RADIUS, 0, Math.PI *2);
            context.fill();
            
        }
       
}
function enemyShoot(){
    
    var randomRow = Math.floor(Math.random() *(ROWS));
    var randomColumn =Math.floor(Math.random() *(COLUMN-1));
    while(hitStates[randomRow][randomColumn].hit){
        randomRow = Math.floor(Math.random() *ROWS);
        randomColumn =Math.floor(Math.random() *COLUMN);
    }
    var shot = {x:hitStates[randomRow][randomColumn].x, y:hitStates[randomRow][randomColumn].y}
    if(enemyShots.length < 2)
        enemyShots.push(shot)


}
function display_records(message){
    GameMusic.pause();
    GameMusic.currentTime = 0;
    var str="your records" +"\n" + record_history.name +"-\n";
    for (var i=0; i<record_history.records.length;i++){
        str+=record_history.records[i]+"\n";
    }
    alert(message);
    document.getElementById("game").style.display = "none";
    document.getElementById("after_game").style.display = "block";
    updateLeaderboard();
    resetElements();
}
function UpdatePosition() {
    var x = GetKeyPressed();
    if(liveRemaining==0){
        youLostMusic.currentTime = 0;
        youLostMusic.play();
        stopTimer();
        record_history.records.push(points);
        display_records("You Lost");

    }
    if(points==250){
        youWonMusic.currentTime = 0;
        youWonMusic.play();
        stopTimer();
        record_history.records.push(points);
        display_records("Champion!");
        
    }
    if(INITIAL_GAME_TIME-time_elapes<=0.5){
        if(points<100){
            youLostMusic.currentTime = 0;
            youLostMusic.play();
            record_history.records.push(points);
            stopTimer();
            display_records("you can do better");
            
        }
        else{
            youWonMusic.currentTime = 0;
            youWonMusic.play();
            record_history.records.push(points);
            stopTimer();
            display_records("winner");
        }
    }
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
    if(x==5){//shoot
        if(!cannonballOnScreen){
            ShipShot(); 
            
        }  

    }
        for(var i=0;i<ROWS;i++){
            for(var j=0;j<COLUMN;j++){
                hitStates[i][j].x += enemiesVelocity;
                if(!hitStates[i][j].hit){
                if(hitStates[i][j].x+radius>canvas.width){
                    hitStates[i][j].x=970;
                    enemiesVelocity*=-1;
                    updateEnemyPosition("right");
                }
                if(hitStates[i][j].x<radius){
                    hitStates[i][j].x=30;
                    enemiesVelocity*=-1;
                    updateEnemyPosition("left");
                }
            }
            }
        }
    
    var nowTime = new Date();
    time_elapes = (nowTime-startTime)/1000;    
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
                            enemieskilled++;
                            points+=20-i*5;
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
function updateEnemyPosition(direction){
    var gap=80;
    if(direction==="right"){
       
        for (let i = ROWS-1; i >=0; i--) {
         for (let j = COLUMN-2; j >= 0; j--) {
            if(!hitStates[i][j].hit){
             hitStates[i][j].x=hitStates[i][j+1].x-gap;
            }
         }
     }
    }
    else{
        for (let i = 0; i <ROWS; i++) {
         for (let j = 2; j <COLUMN; j++) {
            if(!hitStates[i][j].hit){
             hitStates[i][j-1].x=hitStates[i][j].x-gap;
            }
         }

    }
}

}
function ShipShot(){
    // if (cannonballOnScreen) // if a cannonball is already on the screen
    // return; // do nothing

 // move the cannonball to be inside the cannonS
ShipShotSound.currentTime = 0;
ShipShotSound.play();
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
