'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const CELLS_IN_ROW = 12;
    const gameBoard = document.getElementById('gameBoard');

    function randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let gridCells;
    let snake = [];
    let food = {};
    let score = 0;

    const scoreEl = document.getElementById('score');

    function coordsToIndex(x, y) {
        return x + (y * CELLS_IN_ROW);
    }

    // Draw game board, snake and food
    function drawGame() {
        snake = [
            {x: 4, y: 5}, // Head
            {x: 4, y: 6},
            {x: 4, y: 7}  // Tail
        ];

        gameBoard.innerHTML = '';

        for (let i = 0; i < CELLS_IN_ROW * CELLS_IN_ROW; i++) {
            const element = document.createElement('div');
            element.classList.add('grid-cell');
            gameBoard.append(element);
        }

        gridCells = document.querySelectorAll('.grid-cell');

        drawSnake();
        drawFood();
        drawScore();
    }
    drawGame();

    function drawSnake() {
        gridCells.forEach(item => item.classList.remove('snake-part'));

        snake.forEach(item => {
            const index = coordsToIndex(item.x, item.y);
            gridCells[index].classList.add('snake-part');
        });
    }

    function drawFood() {
        food.x = randomIntFromInterval(0, 11);
        food.y = randomIntFromInterval(0, 11);

        if (snake.some(item => item.x === food.x && item.y === food.y)) return drawFood();

        const index = coordsToIndex(food.x, food.y);
        gridCells[index].classList.add('food');
    }

    let intervalId; // To stop the interval later
    let moveInterval = 250 // This controls how fast the snake moves

    function changeSpeed(newMoveInterval) {
        clearInterval(intervalId); // Prevent multiple intervals from running simultaneously
        moveInterval = newMoveInterval;
        intervalId = setInterval(moveSnake, moveInterval);
    }

    function drawScore() {
        scoreEl.textContent = score;
        if (score === 50) endGame('won');
        if (score === 15) changeSpeed(200);
        if (score === 35) changeSpeed(150);
    }

    // Initialize the movement of the snake, starting the game's main loop
    intervalId = setInterval(moveSnake, moveInterval);

    let snakeDirection = null; // This variable will hold the current direction of the snake
    let newDirectionSet = false; // Flag indicating if a new direction has already been set since the last move

    function endGame(state) {
        if (state === 'lose') {
            alert(`GAME OVER =( Your score is ${score}`);
        } else {
            alert(`YOU WON! Your score is ${score}`);
        }
        snakeDirection = null;
        score = 0;
        gridCells.forEach(item => {
            item.classList.remove('snake-part', 'food');
        })
        drawGame();
    }

    function moveSnake() {
        newDirectionSet = false; // Reset the flag at each move function call

        if (!snakeDirection) {
            return;
        }

        if (snakeDirection === 'UP') {
            if (snake[0].y - 1 < 0) {
                return endGame('lose');
            }

            snake.unshift({x: snake[0].x , y: snake[0].y - 1});
            if (checkIfSnakeCrashed()) {
                return endGame('lose');
            }
        }

        if (snakeDirection === 'LEFT') {
            if (snake[0].x % CELLS_IN_ROW === 0 || snake[0].x - 1 < 0) {
                return endGame('lose');
            }

            snake.unshift({x: snake[0].x - 1 , y: snake[0].y});
            if (checkIfSnakeCrashed()) {
                return endGame('lose');
            }
        }

        if (snakeDirection === 'DOWN') {
            if (snake[0].y + 1 >= CELLS_IN_ROW) {
                return endGame('lose');
            }

            snake.unshift({x: snake[0].x, y: snake[0].y + 1});
            if (checkIfSnakeCrashed()) {
                return endGame('lose');
            }
        }

        if (snakeDirection === 'RIGHT') {
            if ((snake[0].x + 1) % CELLS_IN_ROW === 0 || snake[0].x + 1 >= gridCells.length) {
                return endGame('lose');
            }

            snake.unshift({x: snake[0].x + 1, y: snake[0].y});
            if (checkIfSnakeCrashed()) return endGame('lose');
        }

        if (!checkIfFoodReached()) {
            snake.pop();
            return drawSnake();
        }

        drawFood();
        drawSnake();
        drawScore();
    }

    const eatingFood = new Audio('food.mp3');

    function checkIfFoodReached() {
        if (snake[0].x === food.x && snake[0].y === food.y) {
            const index = coordsToIndex(food.x, food.y);
            gridCells[index].classList.remove('food');
            score += 1;
            eatingFood.play();
            return true;
        }
        return false;
    }

    function checkIfSnakeCrashed() {
        const index = coordsToIndex(snake[0].x, snake[0].y);
        return gridCells[index].classList.contains('snake-part');
    }

    document.addEventListener('keydown', (e) => {
        // This event listener updates the snake's direction based on key presses
        if (newDirectionSet) {
            // If the direction has already been changed since the last move, ignore the key press
            return;
        }

        let newDirection;

        switch (e.code) {
            case 'KeyW':
                if (snakeDirection !== 'DOWN') newDirection  = 'UP';
                break;
            case 'KeyA':
                if (snakeDirection !== 'RIGHT') newDirection = 'LEFT';
                break;
            case 'KeyS':
                if (snakeDirection !== 'UP' && snakeDirection !== null) newDirection  = 'DOWN';
                break;
            case 'KeyD':
                if (snakeDirection !== 'LEFT') newDirection  = 'RIGHT';
                break;
        }

        if (newDirection && snakeDirection !== newDirection) {
            snakeDirection = newDirection;
            newDirectionSet = true; // Set the flag to indicate that the direction has been changed
        }
    });
});