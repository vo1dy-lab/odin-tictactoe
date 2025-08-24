"use strict"

const htmlPlayerNameInput1 = document.querySelector("#player1_name");
const htmlPlayerNameInput2 = document.querySelector("#player2_name");
const htmlForm = document.querySelector("form");
const htmlStartGameBtn = document.querySelector("#start");
const htmlRestartGameBtn = document.querySelector("#restart");
const htmlCells = document.querySelectorAll(".cell");
const htmlGameStatus = document.querySelector(".game-status");

const gameBoard = (function () {
    const board = new Array(9);

    const initialize = () => {
        board.fill(null);
    };

    const setMark = (playerMark, cell) => {
        const mark = board[cell];
        if (!mark) {
            board[cell] = playerMark;
            return true;
        }

        return false;
    };
    const getCell = (cell) => board[cell];
    const getBoard = () => board;

    return { setMark, getCell, getBoard, initialize };
})();

function Player(mark, name) {
    const getMark = () => mark;
    const getName = () => name;

    return { getMark, getName };
}

function GameController(player1, player2) {
    let currentPlayer = player1;
    let isGameOver = false;
    let winner = null;

    const playRound = (cell) => {
        if (isGameOver) return;
        if (gameBoard.setMark(currentPlayer.getMark(), cell)) {
            const board = gameBoard.getBoard();
            const winDetected = isWin(board);
            const tieDetected = isTie(board);
            if (winDetected) {
                isGameOver = true;
                winner = currentPlayer.getName();
            } else if (tieDetected) {
                isGameOver = true;
                winner = null;
            } else {
                switchPlayer();
            }
        }
        updateScreen();
    };
    const switchPlayer = () => currentPlayer = currentPlayer === player1 ? player2 : player1;
    const isWin = (board) => {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];

        for (let condition of winConditions) {
            let [a, b, c] = condition;
            if (!!board[a] && board[a] === board[b] && board[a] === board[c]) return true;
        }
        return false;
    };
    const isTie = (board) => board.every((cell) => !!cell);

    const updateScreen = () => {
        const board = gameBoard.getBoard();
        htmlCells.forEach((cell, index) => {
            cell.textContent = board[index];
        });

        if (isGameOver && winner) {
            htmlGameStatus.textContent = `${winner} has won!`;
            htmlRestartGameBtn.classList.toggle("hide");
        } else if (isGameOver && !winner) {
            htmlGameStatus.textContent = `It's tie!`;
            htmlRestartGameBtn.classList.toggle("hide");
        } else {
            htmlGameStatus.textContent = `${currentPlayer.getName()}'s turn.`;
        }
    };

    htmlCells.forEach((cell, index) => cell.addEventListener('click', () => playRound(index)));
    updateScreen();

    return { playRound };
}

function startGame(event) {
    const player1Name = htmlPlayerNameInput1.value;
    const player2Name = htmlPlayerNameInput2.value;

    if (player1Name.length > 0 && player2Name.length > 0) {
        event.preventDefault()

        const player1 = Player("X", player1Name);
        const player2 = Player("O", player2Name);
        activeGame = GameController(player1, player2);
        gameBoard.initialize();
        htmlStartGameBtn.classList.toggle("hide");
    }
}

function restartGame() {
    htmlStartGameBtn.classList.toggle("hide");
    htmlRestartGameBtn.classList.toggle("hide");
    htmlCells.forEach(cell => cell.textContent = "");
    htmlForm.reset();
    activeGame = null;
    gameBoard.initialize();
    htmlGameStatus.textContent = "Enter your names to start the game";
}


let activeGame = null;
htmlStartGameBtn.addEventListener('click', startGame);
htmlRestartGameBtn.addEventListener('click', restartGame);
