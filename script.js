// Get all the cells
const cells = document.querySelectorAll('.cell');

// Variable to keep track of the current player (X or O)
let currentPlayer = 'X';

// Variable to keep track of the game state (the board)
const gameState = 
['', '', '',
 '', '', '',
'', '', ''];

// Flag to indicate whether it's the player's turn
let playerTurn = true;

// Function to check if the game is over and return the result
function checkResult(gameState) {
    // Define the winning combinations
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // Check for a win
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a];
        }
    }

    // Check for a draw
    if (!gameState.includes('')) {
        return 'draw';
    }

    // Game still ongoing
    return null;
}

// Minimax function for the computer player
function minimax(gameState, depth, isMaximizing) {
    const result = checkResult(gameState);

    if (result !== null) {
        if (result === 'O') {
            return 1;
        } else if (result === 'X') {
            return -1;
        } else {
            return 0; // It's a draw
        }
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O';
                const score = minimax(gameState, depth + 1, false);
                gameState[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'X';
                const score = minimax(gameState, depth + 1, true);
                gameState[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Function to find the best move for the computer player
function findBestMove(gameState) {
    let bestMove;
    let bestScore = -Infinity;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            const score = minimax(gameState, 0, false);
            gameState[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

     // Update the game board visually
     gameState[bestMove] = 'O';
     cells[bestMove].classList.add('o');
     cells[bestMove].dataset.cell = 'O';

      // Re-enable player interaction
      // Check for game over
    if (checkGameOver()) return;
    playerTurn = true;
    currentPlayer = 'X';

 

    return bestMove;
}

// ... Rest of your code


// Function to check if the game is over (win, lose, or draw)
function checkGameOver() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];
    console.log("hey");
    // Check if the game is won by the player (X) or the computer (O)
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            // Game is won by the current player
            displayMessage(`${currentPlayer === 'X' ? 'You won' : 'You lost'}!`);
            return true;
        }
    }

    // Check if it's a draw
    if (!gameState.includes('')) {
        displayMessage("It's a draw!");
        return true;
    }

    return false;
}

// Function to display a message at the bottom of the board
function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;

    const button = document.createElement('button');
    button.textContent = 'Play Again';
    button.className = 'play-again-button'; // Add the CSS class
    button.addEventListener('click', () => {
        // You can define the action for the "Play Again" button here
        resetGame(); // For example, this can be a function to reset the game
    });
    messageElement.appendChild(document.createElement('br')); // Add a line break
    messageElement.appendChild(document.createElement('br')); // Add a line break
    messageElement.appendChild(button);
}

function resetGame() {
    // Reset the game logic
    gameState.fill(''); // Reset the game state array
    playerTurn = true;  // Set it to the player's turn
    currentPlayer = 'X'; // Set current player to X

    // Clear the game board visually
    cells.forEach(cell => {
        cell.textContent = ''; // Remove X, O marks from cells
        cell.classList.remove('x', 'o'); // Remove any class (X, O) from cells
        cell.dataset.cell = ''; // Clear data-cell attributes
    });

    // Clear the win/draw message
    const messageElement = document.getElementById('message');
    messageElement.textContent = '';
}



// Add a click event listener to each cell
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      // Check if it's the player's turn and if the cell is empty
      if (playerTurn && !cell.dataset.cell) {
        if (checkGameOver()) return;
        // Prevent further player interaction
        playerTurn = false;

        // Set the data-cell attribute to mark this cell
        cell.dataset.cell = currentPlayer;
  
        // Update the game state
        gameState[index] = currentPlayer;
  
        // Add or remove the 'x' or 'o' class based on the current player
        cell.classList.add(currentPlayer.toLowerCase()); // Adds 'x' or 'o' class
  
        // Check for a win, draw, or switch players (not implemented here)
        if (checkGameOver()) return;
        // ...

        // Make a random move for the computer player
        setTimeout(() => findBestMove(gameState), 600);
        
        if (checkGameOver()) return;
  
        // Toggle the current player for the next move
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        console.log(gameState);
      }
    });
  });
