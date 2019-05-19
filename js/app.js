
/** xx 1, 102, 203, 304, 405 */
/** yy 320 green, 237, 154, 71 */

const checkForCollision = enemy => {
    let collisionY = enemy.y === player.y;
    let collisionX = (enemy.x + 55 > player.x && enemy.x < player.x) || (enemy.x + 55 > player.x + 50 && enemy.x < player.x + 50);
   if(collisionY && collisionX){
        resetPlayer();
        loseScorePoints();
    }
}

class Enemy{
    constructor(x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = 'images/enemy-bug.png'
    }
    update(dt){

        // Enemies are moving 
       if(this.x > 505){
            this.x = -101; 
            if(this.y === 71){
                this.y = 154;
            }else if(this.y === 154){
                this.y = 237;
            }else if(this.y === 237){
                this.y = 71;
            }
        }else{
            this.x = this.x + this.speed;
        }

        // Collision for every enemy 
        checkForCollision(this); 
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Player{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-boy.png';
    }
    update(dt){
        playerStaysInField();
        playerAfterWin();
        collectGems();
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput(e){
        // Player moves on the board
        if(e==='left'){
            this.x -= 101;  
        }else if(e==='right'){
            this.x += 101;
        }else if(e==='up'){
            this.y -= 83; 
        }else if(e==='down'){
            this.y += 83;
        }
    }
}

class GreenGem{
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.sprite = 'images/Gem Green.png'
    }
    update(dt){

    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class OrangeGem{
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.sprite = 'images/Gem Orange.png'
    }
    update(dt){

    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Key{
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.sprite = 'images/Key.png'
    }
    update(dt){

    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// handy functions 
// player goes to start position
function resetPlayer(){
    player.y = 403;
    player.x = 203;
}

// player can't go outside the field
function playerStaysInField(){
    if(player.x < 1){
        player.x = 1;
    }else if(player.x > 405){
        player.x = 405;
    }else if(player.y < -12){
        player.y = -12;
    }else if(player.y > 403){
        player.y = 403;
    }
}

function playerWon(){
    return (player.y < 0);
}

//if one reaches the water
function playerAfterWin(){
    if(playerWon()){
        getScorePoints();
        resetPlayer();
        placeGems();
    }
}
//score counting 
let score = 3;

function getScorePoints(){
    //a winner gets a win sound
    const winBleep = new Audio();
    winBleep.src = "js/audio/Winning-sound-effect.mp3"
    winBleep.play();

    //a winner gets one more life
    score += 1;
    const scorePoint = document.querySelector('.points')
    scorePoint.innerHTML = ' ' + score;  
}

//losing points by collision
function loseScorePoints(){

    //a sound if one has a collision
    const failureSound = new Audio();
    failureSound.src = "js/audio/fail-buzzer-02.mp3"
    failureSound.play();

    //a loser loses one life
    score -= 1;
    const restartButton = document.querySelector('.btn');
    const popup = document.querySelector('.lose-pop-up');
    const scorePoint = document.querySelector('.points');

    //it is substracted from the score
    scorePoint.innerHTML = ' ' + score;

    //if there is no more life the game is over
    if (score <= 0){
        popup.style.display = 'block';
        const gameOverSound = new Audio();
        gameOverSound.src = "js/audio/Sad_Trombone-Joe_Lamb-665429450.mp3"
        gameOverSound.play();
    }
    
    //one can start a new game
    restartButton.addEventListener('click', function(btn){
        //player is on start position
        resetPlayer();

        //he has 3 lives
        score = 3;
        scorePoint.innerHTML = ' ' + score;

        //no gems at first
        greenGemCounter = 0;
        greenGemScore.innerHTML = greenGemCounter;
        orangeGemCounter = 0;
        orangeGemScore.innerHTML = orangeGemCounter;
        keyCounter = 0;
        keyScore.innerHTML = keyCounter;

        //pop up goes away
        popup.style.display = 'none';

        //place new gems
        placeGems();
    });
}

//let the user select a player only at the beginning, not after "play again"
function selectPlayer(){
    let avatars = document.querySelectorAll('.avatar')
    avatars.forEach(function(avatar){
        avatar.addEventListener('click', function(){ 
           let avatarName = 'images/' + avatar.classList[1];
            player.sprite = avatarName;
            const selectPlayerPopup = document.querySelector('.select-player');
            selectPlayerPopup.style.display = 'none';
        });
    });
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(originalArray) {
    let array = [...originalArray];
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//places gems in the different positions on the battle field
function placeGems(){
    const battleFieldArrayX = [1, 102, 203, 304, 405];
    const battleFieldArrayY = [71, 154, 237]; 

    let shuffledArrayX = shuffle(battleFieldArrayX);
    let shuffledArrayY = shuffle(battleFieldArrayY);
    greenGem.x = shuffledArrayX[0];
    greenGem.y = shuffledArrayY[1];

    orangeGem.x = shuffledArrayX[2];
    orangeGem.y = shuffledArrayY[0];

    key.x = shuffledArrayX[4];
    key.y = shuffledArrayY[2];
}


//for collecting gems
let greenGemCounter = 0;
const greenGemScore = document.querySelector('.greenGem');
let orangeGemCounter = 0;
const orangeGemScore = document.querySelector('.orangeGem');
let keyCounter = 0;
const keyScore = document.querySelector('.key');

//what heppens when a player gets a gem
function collectGems(){
    const gotGem = new Audio();
    gotGem.src = "js/audio/888.mp3";
    if(player.x === greenGem.x && player.y === greenGem.y){
        greenGemCounter += 1;
        greenGemScore.innerHTML = greenGemCounter;
        gotGem.play();
        greenGem.x = 203;
        greenGem.y = -999;
    }else if(player.x === orangeGem.x && player.y === orangeGem.y){
        orangeGemCounter += 1;
        orangeGemScore.innerHTML = orangeGemCounter;
        gotGem.play();
        orangeGem.x = 203;
        orangeGem.y = -999;
    }else if(player.x === key.x && player.y === key.y){
        keyCounter += 1;
        keyScore.innerHTML = keyCounter;
        gotGem.play();
        key.x = 203;
        key.y = -999;
    }
}

//initiating player and enemies
const player = new Player(203, 403);
const allEnemies = [new Enemy(0, 237, 2), new Enemy(0, 154, 4), new Enemy(0, 71, 8)];
const greenGem = new GreenGem(102, 154);
const orangeGem = new OrangeGem(304, 71);
const key = new Key(1, 71);
selectPlayer();
placeGems();

/** xx 1, 102, 203, 304, 405 */
/** yy 320 green, 237, 154, 71 */