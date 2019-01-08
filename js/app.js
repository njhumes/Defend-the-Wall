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
        }, 1000)
    },
    gameOver(){
        if(game.lives < 0){
            alert('Game Over');
            $('#lives').text(`Game Over`)
            $('header').append(`<button>Try Again</button>`);
            clearInterval(enemyTimer);  
        }
    }
}

$('#start-button').click(game.startGame);

// Making game board
for (let y = 18; y > 0; y--) {
    const $row = $('<div/>').addClass('game-row');
    $('#game-display').append($row)
    for (let x = 1; x < 36; x++) {
        const $gameSquare = $(`<div>x: ${x}, y: ${y}</div>`).addClass('game-square').attr('x', x).attr('y', y);
        // const $gameSquare = $(`<div/>`).addClass('game-square').attr('x', x).attr('y', y);
        $('#game-display').append($gameSquare);
    }
}

class Character {
    constructor() {
        this.x = 1;
        this.y = 9;
        this.active = true;
    }
    render() {
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
        if (this.y < 18 && this.y > 0){
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
    constructor(x, y){
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
        enemies.push(new Enemy(36, Math.floor(Math.random() * 18)));
        // enemies[enemies.length-1].render();
        for (let j = 0; j < enemies.length; j++) {
            // enemies[j].render()
            enemies[j].advance();
            enemies[j].loseLife();
        }
}    

