console.log('test')
const game = {
    level: 1,
    score: 0,
    lives: 3,
    time: setInterval(function(){
        game.time++;
    }, 1000)
}

// Making game board
for (let y = 18; y > 0; y--) {
    const $row = $('<div/>').addClass('game-row');
    $('#game-display').append($row)
    for (let x = 1; x < 36; x++) {
        // const $gameSquare = $(`<div>x: ${x}, y: ${y}</div>`).addClass('game-square').attr('x', x).attr('y', y);
        const $gameSquare = $(`<div/>`).addClass('game-square').attr('x', x).attr('y', y);
        $('#game-display').append($gameSquare);
    }
}

class Character {
    constructor() {
        this.x = 1;
        this.y = 9;
    }
    render() {
        $('.ship').removeClass('ship');
        $(`.game-square[x="${this.x}"][y="${this.y}"]`).addClass('ship');
        console.log(`player x: ${this.x}`)
        console.log(`player y: ${this.y}`)
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
class Laser {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    attack() {
        this.x++;
        // $('.laser').removeClass('laser');
        $(`.game-square[x="${this.x - 1}"][y="${this.y}"]`).removeClass('laser');
        $(`.game-square[x="${this.x}"][y="${this.y}"]`).addClass('laser');
        // if ($(`.game-square[x="${this.x}"][y="${this.y}"]`).hasClass('enemy')) {
        //     $(`.game-square[x="${this.x}"][y="${this.y}"]`).removeClass('laser');
        //     $(`.game-square[x="${this.x}"][y="${this.y}"]`).removeClass('enemy');
        //     console.log('collision');
        // console.log(`the laser is at ${this.x} ${this.y}`)
        // console.log(`the player is at ${player.x} ${player.y}`)
    }
    collide() {
        if($(`.game-square[x="${this.x}"][y="${this.y}"]`).hasClass('enemy')){
            $(`.game-square[x="${this.x}"][y="${this.y}"]`).removeClass('laser');
            $(`.game-square[x="${this.x}"][y="${this.y}"]`).removeClass('enemy');
            console.log('collision');
        }
    }
}

let wolf;
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
        wolf = new Laser(player.x, player.y); 
        currentWolves.push(wolf);
        timer;
        wolf.collide();
        // currentWolves.forEach(wolf.attack())
    }
})

let timer = setInterval(timedAttack, 100)
function timedAttack() {
    for(let i = 0; i < currentWolves.length; i++){
        currentWolves[i].attack();
        currentWolves[i].collide();

    }
}

class Enemy {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    render() {
        // $('.enemy').removeClass('enemy');
        $(`.game-square[x="${this.x}"][y="${this.y}"]`).addClass('enemy');
    }
    advance() {
        this.x--;
        $(`.game-square[x="${this.x + 1}"][y="${this.y}"]`).removeClass('enemy');
        $(`.game-square[x="${this.x}"][y="${this.y}"]`).addClass('enemy');
    }
}

let whiteWalker;
let enemies = [];
function createEnemy() {
    whiteWalker = new Enemy(36, Math.floor(Math.random() * 18));
    enemies.push(whiteWalker);
}
function enemiesAttack() {
    // if(enemies.length < 10){
    createEnemy();
    for (let j = 0; j < enemies.length; j++) {
        // enemies[j].render();
         enemies[j].advance();
         currentWolves[j].collide();
    }
// }
}
let enemyTimer = setInterval(enemiesAttack, 1000);  

