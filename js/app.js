
const checkForCollision = enemy => {
    let collisionYRules = enemy.y === player.y;
    let collisionXRules = (enemy.x + 55 > player.x && enemy.x < player.x) || (enemy.x + 55 > player.x + 50 && enemy.x < player.x + 50);
   if(collisionYRules && collisionXRules){
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
      /*  if(this.x > 505){
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
        }*/

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
        this.sprite = 'images/char-boy.png'
    }
    update(dt){
        playerStaysInField();
        playerAfterWin();
        
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
        resetPlayer();
        score = 3;
        scorePoint.innerHTML = ' ' + score;
        popup.style.display = 'none';
    });
}


//initiating player and enemies
const player = new Player(203, 403);
const allEnemies = [new Enemy(0, 237, 2), new Enemy(0, 154, 4), new Enemy(0, 71, 8)];

