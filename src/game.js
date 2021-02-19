import "./styles.css";
import { Player } from "./Player";
import Board from "./Board";
import createElement from "./utils/createElement";

const board = new Board();
const playerOne = new Player("Player 1", "white", true);
const playerTwo = new Player("Player 2", "black", false);

class Game {
  constructor(outputDiv, board, player1, player2) {
    this.outputDiv = outputDiv;
    this.board = board;
    this.player1 = player1;
    this.player2 = player2;
  }
  start() {
    const gameBoard = board.initialise();
    const container = document.getElementById(this.outputDiv);
    const chessBoard = createElement({
      type: "div",
      classList: ["chessBoard"]
    });
    for (let row in gameBoard) {
      for (let square in gameBoard[row]) {
        chessBoard.appendChild(gameBoard[row][square]);
      }
    }
    container.appendChild(chessBoard);
  }
}

const game = new Game("game", board, playerOne, playerTwo);

game.start();
