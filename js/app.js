'use strict';

//xx and yy
const battleFieldArrayX = [1, 102, 203, 304, 405];
const battleFieldArrayY = [71, 154, 237]; 

//score counting ans sounds
let score = 3;
const winBleep = new Audio();
winBleep.src = 'js/audio/Winning-sound-effect.mp3';
const failureSound = new Audio();
failureSound.src = 'js/audio/fail-buzzer-02.mp3';
const gameOverSound = new Audio();
gameOverSound.src = 'js/audio/Sad_Trombone-Joe_Lamb-665429450.mp3';
const gotGem = new Audio();
gotGem.src = "js/audio/888.mp3";

//for collecting gems
let greenGemCounter = 0;
const greenGemScore = document.querySelector('.greenGem');
let orangeGemCounter = 0;
const orangeGemScore = document.querySelector('.orangeGem');
let keyCounter = 0;
const keyScore = document.querySelector('.key');

class Enemy{
    constructor(x, y, speed){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = 'images/enemy-bug.png'

        this.checkForCollision = function(){
            let collisionY = this.y === player.y;
            let collisionX = (this.x + 55 > player.x && this.x < player.x) || (this.x + 55 > player.x + 50 && this.x < player.x + 50);
           if(collisionY && collisionX){
                player.resetPlayer();
                loseScorePoints();
                placeGems();
            }
        }
    };

    update(dt){
      
        // Enemies are moving 
        if (this.x > 505){
            this.x = -101; 
            this.y = battleFieldArrayY[Math.round(Math.random() * 2)];
        }else{
            this.x = this.x + this.speed;
        }
        
        // Collision for every enemy 
       this.checkForCollision(); 
    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Player{
    constructor(){
        this.x = 203;
        this.y = 403;
        this.sprite = 'images/char-boy.png';

        this.resetPlayer = function(){
            this.x = 203;
            this.y = 403;
        }

        this.won = function(){
            return (player.y < 0);           
        }
        
        this.afterWin = function(){
            this.resetPlayer();
            getScorePoints();
            placeGems();    
        }
    }

    update(dt){    
    }

    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(e){
        // Player moves on the board and stays in the feild
        if(e==='left'){
            this.x -= 101;

            //if the end of the field player cannot go further to the left
            if(this.x < 1){
                this.x = 1;
                }     
        }else if(e==='right'){
            this.x += 101;

             //if the end of the field player cannot go further to the right
            if(this.x > 405){
                this.x = 405;
                }
        }else if(e==='up'){
            this.y -= 83;

            //if a player reaches water he won, got a score and is on his start position
            if(this.won()){
                this.afterWin();
                } 
        }else if(e==='down'){
            this.y += 83;

             //if the end of the field player cannot go further down
            if(this.y > 403){
                this.y = 403;
                }
        }
        greenGem.isCollected();
        orangeGem.isCollected();
        key.isCollected();
    }
}

class Gem{
    constructor(x, y){
        this.x = x;
        this.y = y;
    
        this.removeFromField = function(){
            this.y = -999;
        }

        //what happens if a gem is collected
        this.isCollected = function(){
            if (player.x === this.x && player.y === this.y){
                this.removeFromField();
                gotGem.play();

                if(this === greenGem){
                    greenGemCounter += 1;
                    greenGemScore.innerHTML = greenGemCounter;
                }else if(this === orangeGem){
                    orangeGemCounter += 1;
                    orangeGemScore.innerHTML = orangeGemCounter;
                }else if(this === key){
                    keyCounter += 1;
                    keyScore.innerHTML = keyCounter;
                }
            }
        }
       
        //place gems on field 
        this.placeOnField = function(){
            this.x = battleFieldArrayX[Math.round(Math.random() * 4)];
            this.y = battleFieldArrayY[Math.round(Math.random() * 2)];  
            }
        }
    update(dt){

    }
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class GreenGem extends Gem{
    constructor (x, y){
        super(x, y);
        this.sprite = 'images/Gem_Green.png';
    }
}

class OrangeGem extends Gem{
    constructor (x, y){
        super(x, y);
        this.sprite = 'images/Gem_Orange.png';
    }
}

class Key extends Gem{
    constructor (x, y){
        super(x, y);
        this.sprite = 'images/Key.png';
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
function getScorePoints(){
    //a winner gets a win sound
    winBleep.play();

    //a winner gets one more life
    score += 1;
    const scorePoint = document.querySelector('.points');
    scorePoint.innerHTML = ' ' + score;  
}

//losing points by collision
function loseScorePoints(){

    //a sound if one has a collision
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
        gameOverSound.play();
    }
    
    //one can start a new game
    restartButton.addEventListener('click', function(btn){
        const selectPlayerPopup = document.querySelector('.select-player');
        selectPlayerPopup.style.display = 'block'; 
        selectPlayer();
        
        //player is on start position
        player.resetPlayer();

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

//let user select a player
function selectPlayer(){
    let avatars = document.querySelectorAll('.avatar');
    avatars.forEach(function(avatar){
        avatar.addEventListener('click', function(){ 
            let avatarName = 'images/' + avatar.classList[1];
            player.sprite = avatarName;
            const selectPlayerPopup = document.querySelector('.select-player');
            selectPlayerPopup.style.display = 'none';
        });
    });
}

//places gems in the different positions on the battle field
function placeGems(){
    greenGem.placeOnField();
    orangeGem.placeOnField();
    key.placeOnField();
}

function toCheckGitHub(){
    
}

//player, enemies, gems
const player = new Player();
const allEnemies = [new Enemy(0, 237, 2), new Enemy(0, 154, 4), new Enemy(0, 71, 8)];
const greenGem = new GreenGem(102, 154);
const orangeGem = new OrangeGem(304, 71);
const key = new Key(1, 71);
selectPlayer();
placeGems();
