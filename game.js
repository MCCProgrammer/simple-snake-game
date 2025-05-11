const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');
const highscoreElement = document.getElementById('highscore');
let highscore = localStorage.getItem('snakeHighscore') || 0;
highscoreElement.textContent = highscore;

// Game constants
const GRID_SIZE = 20;
const TILE_COUNT = 20;
const GAME_SPEED = 100;

// Game variables
let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameLoop;
let gameStarted = false;

// Initialize canvas size
function initCanvas() {
    const size = Math.min(window.innerWidth - 40, 500);
    canvas.width = size;
    canvas.height = size;
}

// Initialize game
function initGame() {
    snake = [
        { x: 10, y: 10 }
    ];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    highscoreElement.textContent = highscore;
    generateFood();
}

// Generate food at random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT)
    };

    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            break;
        }
    }
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#4CAF50';
    for (let segment of snake) {
        ctx.fillRect(
            segment.x * (canvas.width / TILE_COUNT),
            segment.y * (canvas.height / TILE_COUNT),
            canvas.width / TILE_COUNT - 2,
            canvas.height / TILE_COUNT - 2
        );
    }

    // Draw food
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(
        food.x * (canvas.width / TILE_COUNT),
        food.y * (canvas.height / TILE_COUNT),
        canvas.width / TILE_COUNT - 2,
        canvas.height / TILE_COUNT - 2
    );
}

// Update game state
function update() {
    const head = { ...snake[0] };

    // Move head based on direction
    switch (direction) {
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

    // Check for collisions
    if (
        head.x < 0 || head.x >= TILE_COUNT ||
        head.y < 0 || head.y >= TILE_COUNT ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOver();
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        if (score > highscore) {
            highscore = score;
            highscoreElement.textContent = highscore;
            localStorage.setItem('snakeHighscore', highscore);
        }
        generateFood();
    } else {
        snake.pop();
    }
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    gameStarted = false;
    startButton.textContent = 'Restart Game';
    alert(`Game Over! Your score: ${score}`);
}

// Game loop
function gameStep() {
    update();
    draw();
}

// Start game
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    startButton.textContent = 'Game Running';
    initGame();
    gameLoop = setInterval(gameStep, GAME_SPEED);
}

// Event listeners
startButton.addEventListener('click', startGame);

window.addEventListener('keydown', (e) => {
    if (!gameStarted) return;

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            if (direction !== 'down') direction = 'up';
            break;
        case 's':
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'a':
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
        case 'd':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Mobile controls
document.getElementById('upButton').addEventListener('click', () => {
    if (direction !== 'down') direction = 'up';
});

document.getElementById('downButton').addEventListener('click', () => {
    if (direction !== 'up') direction = 'down';
});

document.getElementById('leftButton').addEventListener('click', () => {
    if (direction !== 'right') direction = 'left';
});

document.getElementById('rightButton').addEventListener('click', () => {
    if (direction !== 'left') direction = 'right';
});

// Initialize
initCanvas();
window.addEventListener('resize', initCanvas); 