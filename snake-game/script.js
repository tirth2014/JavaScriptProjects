const gameBoard = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreElem = document.getElementById('high-score');

// Game variables
const gridSize = 20;
let gameStarted = false;
let snakeDirection = 'right';
let gameSpeedDelay = 180;
let highScore = 0;
let gameInterval;
let snake = [
    { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }
]

let food = generateFood();

function generateFood() {
    return { x: getRandomCell(gridSize), y: getRandomCell(gridSize) }
}

function getRandomCell(gameBoardSize) {
    return Math.floor(Math.random(gameBoardSize) * 20) + 1;
}

function draw() {
    gameBoard.innerHTML = '';
    drawSnake();
    drawFood();
}

function drawSnake() {
    if (gameStarted) {
        snake.forEach((box) => {
            const snakeElement = createElementOnBoard('div', 'snake')
            setPosition(snakeElement, box);
        })
    }
}

function drawFood() {
    if (gameStarted) {
        const foodElement = createElementOnBoard('div', 'food');
        setPosition(foodElement, food);
    }
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function createElementOnBoard(tag, className) {
    const elem = document.createElement(tag);
    elem.className = className;
    gameBoard.appendChild(elem);
    return elem;
}

function move() {
    const head = { ...snake[0] };

    switch (snakeDirection) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);

    // If snack eats food
    if (head.x === food.x && head.y === food.y) {
        updateScore();
        food = generateFood()
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay)
    }
    else {
        snake.pop();
    }
}

function updateScore(){
    let currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0'); 
}

function increaseSpeed(){
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5
    }
    else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3
    }
    else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2
    }
    else{
        gameSpeedDelay -= 1
    }
}


function startGame() {
    customNotification.style.display = 'none';
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';

    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}

function checkCollision() {
    const head = snake[0];
    // collided with grid
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        displayOuchNotification();
        resetGame();
    }

    // snake collided with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            displayOuchNotification();
            resetGame();            
        }
    }    
}

function displayOuchNotification() {
    const customNotification = document.getElementById('customNotification');
    customNotification.style.display = 'block';
    
    setTimeout(() => {
        customNotification.style.display = 'none';
    }, 3000);
}

function resetGame() {
    updateHighScore();
    instructionText.style.display = 'block';
    logo.style.display = 'block';
    gameStarted = false;
    snakeDirection = 'right';
    gameSpeedDelay = 200;
    snake = [
        { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) }
    ]

    food = generateFood();
    clearInterval(gameInterval);
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if (currentScore > highScore){
        highScore = currentScore;
        highScoreElem.textContent = currentScore.toString().padStart(3, '0');
    }
    highScoreElem.style.display = 'block';
}

function handleKeyPress(event) {
    console.log(event);
    if (
        (!gameStarted && event.code == 'Space') ||
        (!gameStarted && event.key == ' ')) {
        startGame();
    }
    else {
        switch (event.key) {
            case 'ArrowUp':
                snakeDirection = 'up';
                break;
            case 'ArrowDown':
                snakeDirection = 'down';
                break;
            case 'ArrowLeft':
                snakeDirection = 'left';
                break;
            case 'ArrowRight':
                snakeDirection = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress)
