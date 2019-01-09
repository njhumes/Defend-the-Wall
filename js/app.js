// To Do:
// Use only one setInterval
// Create level funcationality
// final boss
// CSS

let enemyTimer;
const game = {
    level: 1,
    score: 0,
    lives: 3,
    time: setInterval(function(){
        game.time++;
    }, 1000),
    active: true,
    startGame(){
        // enemyTimer = setInterval(createEnemy, 1000); it works
        enemyTimer = setInterval(function(){
            createEnemy();
            game.gameOver();
            game.youWon();
        }, 1000)
    },
    gameOver(){
        if(game.lives < 0){
            alert('Game Over');
            $('#lives').text(`Game Over`)
            $('header').append(`<button id='restart'>Try Again</button>`);
            clearInterval(enemyTimer);  
        }
    },
    youWon(){
        if(nightKing.health < 0){
            alert('You won');
            clearInterval(enemyTimer);
        }
    }
}

// Start Button
$('#start-button').click(game.startGame);
// Restart Button
$('header').on('click', '#restart', function(){
    location.reload();
})

// Making game board
for (let y = 11; y > 0; y--) {
    const $row = $('<div/>').addClass('game-row');
    $('#game-display').append($row)
    for (let x = 1; x < 27; x++) {
        const $gameSquare = $(`<div>x: ${x}, y: ${y}</div>`).addClass('game-square').attr('x', x).attr('y', y);
        // const $gameSquare = $(`<div/>`).addClass('game-square').attr('x', x).attr('y', y);
        $('#game-display').append($gameSquare);
    }
}

class Character {
    constructor() {
        this.x = 1;
        this.y = 6;
        this.active = true;
    }
    render() {
        // hard code 
        $('.ship').removeClass('ship');
        $(`.game-square[x="${this.x}"][y="${this.y}"]`).addClass('ship');
        // console.log(`player x: ${this.x}`)
        // console.log(`player y: ${this.y}`)
    }
    moveLeft() {
        if (this.x < 6 && this.x > 1) {
            this.x--;
            this.render();
        }
    }
    moveRight() {
        if (this.x < 5 && this.x > 0) {
            this.x++;
            this.render();
        }
    }
    moveUp() {
        if (this.y < 11 && this.y > 0){
            this.y++;
            this.render();
        }
    }
    moveDown() {
        if (this.y < 19 && this.y > 1) {
            this.y--;
            this.render();
        }
    }
}

const player = new Character();
player.render();
console.log(player.x)


// Prevent Scrolling w Arrow keys
window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// Fire 
class Wolf {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.active = true;
    }
    attack() {
        if(this.active){
            this.x++;
            $(`.game-square[x="${this.x - 1}"][y="${this.y}"]`).removeClass('wolf');
            $(`.game-square[x="${this.x}"][y="${this.y}"]`).addClass('wolf');
        }
    }
    collide() {
        // this always make the game.squre kill htem
        if($(`.game-square[x="${this.x}"][y="${this.y}"]`).hasClass('enemy')){
            this.active = false;
            game.score++;
            $('#score').text(`Score: ${game.score}`);
            for(let m = 0; m < enemies.length; m++){
                if(enemies[m].x == this.x && enemies[m].y == this.y){
                    // currentWolves.splice(m, 1);
                    enemies[m].active = false;
                    // enemies.splice(m, 1);
                }
            }
            $(`.game-square[x="${this.x}"][y="${this.y}"]`).removeClass('wolf');
            $(`.game-square[x="${this.x}"][y="${this.y}"]`).removeClass('enemy');
            console.log('wolf collision');
        }
        if ($(`.game-square[x="${this.x}"][y="${this.y}"]`).hasClass('boss')) {
            this.active = false;
            nightKing.health--;
            $(`.game-square[x="${this.x}"][y="${this.y}"]`).removeClass('wolf');

        }
    }       
}
let currentWolves = [];

// Movement keybindings
$('body').on('keydown', (e) => {
    if (e.which === 37) {
        player.moveLeft();
    } else if (e.which === 39) {
        player.moveRight();
    } else if (e.which === 38) {
        player.moveUp();
    } else if (e.which === 40) {
        player.moveDown();
    } else if (e.which === 32) {
        currentWolves.push(new Wolf(player.x, player.y));
    }
})

let attackTimer = setInterval(timedAttack, 100)
function timedAttack() {
    for(let i = 0; i < currentWolves.length; i++){
        currentWolves[i].attack();
        currentWolves[i].collide();
        if(currentWolves[i].active == false){
            currentWolves.splice(i, 1);
        }
    }
}

class Enemy {
    constructor(x, y,){
        this.x = x;
        this.y = y;
        this.active = true;
    }
    render(){
        $(`.game-square[x="${this.x}"][y="${this.y}"]`).addClass('enemy');
    }
    advance() {
        if(this.active){
            this.x--;
            $(`.game-square[x="${this.x + 1}"][y="${this.y}"]`).removeClass('enemy');
            $(`.game-square[x="${this.x}"][y="${this.y}"]`).addClass('enemy');
        } else {
            $(`.game-square[x="${this.x}"][y="${this.y}"]`).removeClass('enemy');
        }
    }
    loseLife() {
        if(this.x === 1 && $(`.game-square[x="${this.x}"][y="${this.y}"]`).hasClass('enemy')){
            console.log('lost a life');
            game.lives--;
            $('#lives').text(`Lives: ${game.lives}`)
        }
    }
}


let enemies = [];
function createEnemy(){
    if(game.score < 10){
        enemies.push(new Enemy(27, Math.floor(Math.random() * 11)));
        // enemies[enemies.length-1].render();
        for (let j = 0; j < enemies.length; j++) {
            // enemies[j].render()
            enemies[j].advance();
            enemies[j].loseLife();
        }
    } else {
        if(nightKing.health >= 0){
            nightKing.advance();
            $('#score').text(`Final Boss Health: ${nightKing.health}`);
        } 
    }  
}    

let $boss;
class FinalBoss {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.active = true;
        this.health = 10;
    }
    render() {
        $(`.game-square[x="${this.x}"][y="${this.y}"]`).addClass('boss');
    }
    advance() {
        if(this.active){
            console.log(nightKing);
            $(`.game-square[x="${this.x}"][y="${this.y}"]`).removeClass('boss');
            // Can move in any direction
            if(this.x < 25 && this.y > 2 && this.y < 10){
                this.x = this.x + (Math.round(Math.random()) * 2 - Math.round(Math.random()));
                this.y = this.y + (Math.round(Math.random()) * 2 - Math.round(Math.random()));
            }
            // On the right edge
            else if (this.x == 26 || this.x == 25){
                // on right and bottom edges
                if(this.y == 1 || this.y == 2){
                    this.x--;
                    this.y++;
                } else {
                    this.x--;
                    this.y--;
                    // this.y = this.y + (Math.round(Math.random()) * 2 - Math.round(Math.random()))
                }
            }
            // On the bottom edge
            else if (this.y == 1 || this.y == 2) {
                // on bottom and right edges
                if(this.x == 25 || this.x == 26){
                    this.x --;
                    this.y ++;
                } else{
                    this.x = this.x + (Math.round(Math.random()) * 2 - Math.round(Math.random()))
                    this.y++;
                }
            }
            // On the top edge
            else if(this.y == 11 || this.y == 10){
                // on top and right
                if(this.x == 25 || this.x == 26){
                    this.x--;
                    this.y--;
                } else {
                    this.x = this.x + (Math.round(Math.random()) * 2 - Math.round(Math.random()))
                    this.y--;
                }
            }
            // On the left edge
            else if (this.x == 1 || this.x == 2){
                this.x++;
                this.y++;
            }
            $(`.game-square[x="${this.x}"][y="${this.y}"]`).addClass('boss');
        }
    }
}
let nightKing = new FinalBoss(24, 5);

// in my create enemy function
// dont need another set interval
// create finalboss if score > 50;
// 