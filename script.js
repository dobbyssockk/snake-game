'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const CELLS_IN_ROW = 12;
    const gameBoard = document.getElementById('gameBoard');

    function randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let gridCells;
    let snake = [];

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

        drawSnake()
        drawFood();
    }
    drawGame();

    function drawSnake() {
        gridCells.forEach(item => {
            item.classList.remove('snake-part');
        });

        snake.forEach(item => {
            const index = coordsToIndex(item.x, item.y);
            gridCells[index].classList.add('snake-part');
        });
    }

    function drawFood() {
        const foodX = randomIntFromInterval(0, 11);
        const foodY = randomIntFromInterval(0, 11);

        const index = coordsToIndex(foodX, foodY);

        gridCells[index].classList.add('food');
    }

    let snakeDirection = null; // This variable will hold the current direction of the snake

    function endGame() {
        snakeDirection = null;
        gridCells.forEach(item => {
            item.classList.remove('snake-part', 'food');
        })
        drawGame();
    }

    function moveSnake() {
        if (!snakeDirection) {
            return;
        }

        if (snakeDirection === 'UP') {
            if (snake[0].y - 1 < 0) {
                alert('game over');
                endGame();
                return;
            }

            snake.unshift({x: snake[0].x , y: snake[0].y - 1});
            snake.pop();
        }

        if (snakeDirection === 'LEFT') {
            if (snake[0].x % CELLS_IN_ROW === 0 || snake[0].x - 1 < 0) {
                alert('game over');
                endGame();
                return;
            }

            snake.unshift({x: snake[0].x - 1 , y: snake[0].y});
            snake.pop();
        }

        if (snakeDirection === 'DOWN') {
            if (snake[0].y + 1 >= CELLS_IN_ROW) {
                alert('game over');
                endGame();
                return;
            }

            snake.unshift({x: snake[0].x, y: snake[0].y + 1});
            snake.pop();
        }

        if (snakeDirection === 'RIGHT') {
            if ((snake[0].x + 1) % CELLS_IN_ROW === 0 || snake[0].x + 1 >= gridCells.length) {
                alert('game over');
                endGame();
                return;
            }

            snake.unshift({x: snake[0].x + 1, y: snake[0].y});
            snake.pop();
        }

        drawSnake();
    }

    document.addEventListener('keydown', (e) => {
        // This event listener updates the snake's direction based on key presses
        if (e.code === 'KeyW') {
            if (snakeDirection !== 'DOWN') {
                snakeDirection = 'UP';
            }
        }

        if (e.code === 'KeyA') {
            if (snakeDirection !== 'RIGHT') {
                snakeDirection = 'LEFT';
            }
        }

        if (e.code === 'KeyS') {
            if (snakeDirection !== 'UP') {
                if (snakeDirection !== null) {
                    snakeDirection = 'DOWN';
                }
            }
        }

        if (e.code === 'KeyD') {
            if (snakeDirection !== 'LEFT') {
                snakeDirection = 'RIGHT';
            }
        }
    });

    setInterval(moveSnake, 250);
});