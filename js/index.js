"use strict"

const gameBoard = (function () {
    const board = new Array(9);

    const setMark = (playerMark, cell) => {
        const mark = board[cell];
        if (!mark) board[cell] = playerMark;
    };
    const getCell = (cell) => board[cell];
    const getBoard = () => board;

    return { setMark, getCell, getBoard };
})();

function Player(mark) {
    const getMark = () => mark;

    return { getMark };
}

function Game(player1, player2) {
    let currentPlayer = player1;
    let isGameOver = false;
    let winner = null;

    const getCurrentPlayer = () => currentPlayer;
    const getWinner = () => winner;
    const getIsGameOver = () => isGameOver;

    const playRound = (cell) => {
        if (isGameOver) return;

        if (!gameBoard.getCell(cell)) {
            gameBoard.setMark(currentPlayer.getMark(), cell);

            const winDetected = isWin(gameBoard.getBoard());
            if (winDetected) {
                isGameOver = true;
                winner = currentPlayer;
                return;
            }

            const tieDetected = isTie(gameBoard.getBoard());
            if (tieDetected) {
                isGameOver = true;
                winner = null;
                return;
            }

            switchPlayer();
        }
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
            if (!!board[a] && board[a] === board[b] && board[a] === board[c]) return true
        }

        return false;
    };
    const isTie = (board) => board.every((cell) => !!cell);

    return { getCurrentPlayer, getWinner, getIsGameOver, playRound };
}
