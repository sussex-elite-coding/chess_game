import { allPieces, coordsToIndex } from "./drawPieces";
import { board } from "./index";

class ChessPiece {
  constructor(name, id, startPos, colour) {
    this.colour = colour;
    this.currentPos = startPos;
    this.enemyColour = colour === "white" ? "black" : "white";
    this.id = id;
    this.isCaptured = false;
    this.name = name;
    this.numMoves = 0;
    this.piecesCaptured = 0;
    this.possibleMoves = [];
    this.previousSquares = [];
    this.startPos = startPos;
  }
  addHorizontalSquares(radius) {
    const [xPos, yPos] = this.currentPos;
    let leftBound = 0,
      rightBound = 7;
    if (radius === 1) {
      leftBound = xPos === 0 ? 0 : xPos - 1;
      rightBound = xPos === 7 ? 7 : xPos + 1;
    }
    // Left
    for (let i = xPos - 1; i >= leftBound; i--) {
      if (!this.setPossibleMoves(coordsToIndex([i - 1, yPos]))) break;
    }
    // Right
    for (let i = xPos; i < rightBound; i++) {
      if (!this.setPossibleMoves(coordsToIndex([i, yPos]))) break;
    }
  }
  addVerticalSquares(radius) {
    const [xPos, yPos] = this.currentPos;
    let topBound = 0,
      bottomBound = 7;
    if (radius === 1) {
      topBound = yPos - 1;
      bottomBound = yPos + 1;
    }
    // Up
    for (let i = yPos - 1; i >= topBound; i--) {
      if (!this.setPossibleMoves(coordsToIndex([xPos - 1, i]))) break;
    }
    // Down
    for (let i = yPos + 1; i <= bottomBound; i++) {
      if (!this.setPossibleMoves(coordsToIndex([xPos - 1, i]))) break;
    }
  }
  addDiagonalSquares(radius) {
    const currentIndex = coordsToIndex(this.currentPos) - 1;
    let [xPos, yPos] = this.currentPos;

    let iterator = 1;
    while (xPos > 0 && yPos > 0) {
      if (!this.setPossibleMoves(currentIndex - 9 * iterator)) break;
      xPos--;
      yPos--;
      if (iterator < radius || !radius) iterator++;
    }
    [xPos, yPos] = this.currentPos;
    iterator = 1;
    while (xPos < 7 && yPos > 0) {
      if (!this.setPossibleMoves(currentIndex - 7 * iterator)) break;
      xPos++;
      yPos--;
      if (iterator < radius || !radius) iterator++;
    }
    [xPos, yPos] = this.currentPos;
    iterator = 1;
    while (xPos > 0 && yPos < 7) {
      if (!this.setPossibleMoves(currentIndex + 7 * iterator)) break;
      xPos--;
      yPos++;
      if (iterator < radius || !radius) iterator++;
    }
    [xPos, yPos] = this.currentPos;
    iterator = 1;
    while (xPos < 7 && yPos < 7) {
      if (!this.setPossibleMoves(currentIndex + 9 * iterator)) break;
      xPos++;
      yPos++;
      if (iterator < radius || !radius) iterator++;
    }
  }
  detectCollisions(move) {
    const currentIndex = coordsToIndex(this.currentPos);
    const targetSquare = board.childNodes[move];
    let blocked = false;
    blocked = this.colour === targetSquare.firstChild?.dataset.colour;

    if (!blocked && this.name === "pawn") {
      // Check for enemy pieces directly in front
      blocked = this.enemyColour === targetSquare.firstChild?.dataset.colour;
      // Prevent hurdling over other pieces
      if (this.numMoves === 0) {
        const isDoubleMove =
          currentIndex - move > 10 || move - currentIndex > 10;
        if (isDoubleMove) {
          if (this.colour === "white" && board.childNodes[move + 8].firstChild)
            blocked = true;
          if (this.colour === "black" && board.childNodes[move - 8].firstChild)
            blocked = true;
        }
      }
    }

    if (!blocked) return targetSquare;
  }
  setCurrentPos(coords) {
    const targetSquare = coordsToIndex(coords) - 1;
    if (this.enemyPieceAtIndex(targetSquare)) {
      const enemyPiece = allPieces.find(
        (piece) =>
          piece.id === board.childNodes[targetSquare].firstChild.dataset.id
      );
      if (enemyPiece.name === "king") {
        alert("Can't capture a king!");
        return false;
      }
      this.capture(enemyPiece);
    }
    this.previousSquares.push(this.currentPos);
    this.currentPos = coords;
    this.numMoves++;
  }
  setPossibleMoves(square) {
    if (square < 0 || square > 63) return false;
    if (this.friendlyPieceAtIndex(square)) return false;
    if (this.enemyPieceAtIndex(square)) {
      this.possibleMoves.push(square);
      return false;
    }
    this.possibleMoves.push(square);
    return true;
  }
  clearPossibleMoves() {
    this.possibleMoves = [];
  }
  enemyPieceAtIndex(index) {
    return (
      board.childNodes[index].firstChild?.dataset.colour === this.enemyColour
    );
  }
  friendlyPieceAtIndex(index) {
    return board.childNodes[index].firstChild?.dataset.colour === this.colour;
  }
  capture(piece) {
    piece.isCaptured = true;
    this.piecesCaptured++;
  }
}
export class Pawn extends ChessPiece {
  constructor(id, colour, startPos) {
    super("pawn", id, startPos, colour);
    this.icon = "fas fa-chess-pawn";
  }
  getPossibleMoves() {
    const [xPos, yPos] = this.currentPos;
    const direction = this.colour === "white" ? -1 : 1;
    let possibleMoves = [];

    const oneStep = coordsToIndex([xPos - 1, yPos + 1 * direction]);
    const twoStep = coordsToIndex([xPos - 1, yPos + 2 * direction]);
    const oneStepLeft = coordsToIndex([xPos - 2, yPos + 1 * direction]);
    const oneStepRight = coordsToIndex([xPos, yPos + 1 * direction]);

    possibleMoves.push(oneStep);
    if (this.numMoves === 0) possibleMoves.push(twoStep);

    // Filter out collisions
    possibleMoves = possibleMoves.filter((move) => this.detectCollisions(move));

    // Add captures
    if (this.enemyPieceAtIndex(oneStepLeft)) possibleMoves.push(oneStepLeft);
    if (this.enemyPieceAtIndex(oneStepRight)) possibleMoves.push(oneStepRight);

    return possibleMoves;
  }
}
export class Rook extends ChessPiece {
  constructor(id, colour, startPos) {
    super("rook", id, startPos, colour);
    this.icon = "fas fa-chess-rook";
  }
  getPossibleMoves() {
    this.clearPossibleMoves();
    this.addHorizontalSquares();
    this.addVerticalSquares();
    return this.possibleMoves;
  }
}
export class Knight extends ChessPiece {
  constructor(id, colour, startPos) {
    super("knight", id, startPos, colour);
    this.icon = "fas fa-chess-knight";
  }
  getPossibleMoves() {
    this.clearPossibleMoves();
    const [xPos, yPos] = this.currentPos;
    const allMoves = [];

    const addKnightMoves = (xModifier, yModifier) => {
      allMoves.push(coordsToIndex([xPos + xModifier, yPos + yModifier]));
      allMoves.push(coordsToIndex([xPos + xModifier, yPos + yModifier * -1]));
    };
    // Check proximity to left and right edge
    if (xPos > 0) addKnightMoves(-2, 2);
    if (xPos > 1) addKnightMoves(-3, 1);
    if (xPos < 7) addKnightMoves(0, 2);
    if (xPos < 6) addKnightMoves(1, 1);

    const constrained = allMoves
      .filter((move) => move >= 0 && move < 64)
      .filter((move) => !this.friendlyPieceAtIndex(move));

    this.possibleMoves.push(...constrained);
    return this.possibleMoves;
  }
}
export class Bishop extends ChessPiece {
  constructor(id, colour, startPos) {
    super("bishop", id, startPos, colour);
    this.icon = "fas fa-chess-bishop";
  }
  getPossibleMoves() {
    this.clearPossibleMoves();
    this.addDiagonalSquares();
    return this.possibleMoves;
  }
}
export class Queen extends ChessPiece {
  constructor(id, colour, startPos) {
    super("queen", id, startPos, colour);
    this.icon = "fas fa-chess-queen";
  }
  getPossibleMoves() {
    this.clearPossibleMoves();
    this.addHorizontalSquares();
    this.addVerticalSquares();
    this.addDiagonalSquares();
    return this.possibleMoves;
  }
}
export class King extends ChessPiece {
  constructor(id, colour, startPos) {
    super("king", id, startPos, colour);
    this.icon = "fas fa-chess-king";
    this.isInCheck = false;
    this.isCheckMate = false;
  }
  getPossibleMoves() {
    this.clearPossibleMoves();
    this.addHorizontalSquares(1);
    this.addVerticalSquares(1);
    this.addDiagonalSquares(1);
    return this.possibleMoves;
  }
  getStatus() {
    if (this.isInCheck && this.getPossibleMoves().length) return "check";
    if (this.isInCheck && !this.getPossibleMoves().length) return "checkmate";
    return "ok";
  }
}
