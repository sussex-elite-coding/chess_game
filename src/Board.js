import createElement from "./utils/createElement";
import isEven from "./utils/isEven";

export default class Board {
  constructor() {
    this.squares = [];
    this.letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  }
  createSquare(colour, index) {
    const square = createElement({
      type: "div",
      id: index,
      classList: ["square", colour],
      piece: null
    });
    return square;
  }
  initialise() {
    const board = [];
    let colour = "white";

    for (let y = 8; y >= 1; y--) {
      const row = [];
      for (let x = 0; x < 8; x++) {
        const index = this.letters[x] + y;
        if (isEven(y)) {
          colour = isEven(x) ? "white" : "black";
        } else {
          colour = isEven(x) ? "black" : "white";
        }
        const square = this.createSquare(colour, index);
        row.push(square);
      }
      board.push(row);
    }
    return board;
  }
  setPieces() {}
  render() {}
}
