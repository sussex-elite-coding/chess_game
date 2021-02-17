import { Pawn, Rook, Knight, Bishop, Queen, King } from "./ChessPiece";

export default function drawPieces(board) {
  board.childNodes.forEach((node) => {
    node.innerHTML = "";
    node.dataset.pieceId = null;
  });
  allPieces.forEach((piece) => {
    if (!piece.isCaptured) {
      const index = coordsToIndex(piece.currentPos);
      const square = board.querySelector(`.square:nth-child(${index})`);
      square.dataset.pieceId = piece.id;
      square.innerHTML = `<i class="${piece.icon} ${piece.colour}-piece" 
                          data-piece="${piece.name}" 
                          data-id="${piece.id}" 
                          data-colour="${piece.colour}"></i>`;
    }
  });
}

export function coordsToIndex(coords) {
  return coords[1] * 8 + coords[0] + 1;
}

export function coordsFromIndex(index) {
  const rightEdge = index % 8 === 0;
  let xPos;
  rightEdge ? (xPos = 7) : (xPos = Math.round(index % 8) - 1);
  const yPos = Math.round((index - xPos) / 8);
  return [xPos, yPos];
}

export const allPieces = [
  // PAWNS
  new Pawn("WP1", "white", [0, 6]),
  new Pawn("WP2", "white", [1, 6]),
  new Pawn("WP3", "white", [2, 6]),
  new Pawn("WP4", "white", [3, 6]),
  new Pawn("WP5", "white", [4, 6]),
  new Pawn("WP6", "white", [5, 6]),
  new Pawn("WP7", "white", [6, 6]),
  new Pawn("WP8", "white", [7, 6]),
  new Pawn("BP1", "black", [0, 1]),
  new Pawn("BP2", "black", [1, 1]),
  new Pawn("BP3", "black", [2, 1]),
  new Pawn("BP4", "black", [3, 1]),
  new Pawn("BP5", "black", [4, 1]),
  new Pawn("BP6", "black", [5, 1]),
  new Pawn("BP7", "black", [6, 1]),
  new Pawn("BP8", "black", [7, 1]),
  // ROOKS
  new Rook("WR1", "white", [0, 7]),
  new Rook("WR2", "white", [7, 7]),
  new Rook("BR1", "black", [0, 0]),
  new Rook("BR2", "black", [7, 0]),
  // KNIGHTS
  new Knight("WK1", "white", [1, 7]),
  new Knight("WK2", "white", [6, 7]),
  new Knight("BK1", "black", [1, 0]),
  new Knight("BK2", "black", [6, 0]),
  // BISHOPS
  new Bishop("WB1", "white", [2, 7]),
  new Bishop("WB2", "white", [5, 7]),
  new Bishop("BB1", "black", [2, 0]),
  new Bishop("BB2", "black", [5, 0]),
  // QUEENS
  new Queen("WQ", "white", [3, 7]),
  new Queen("BQ", "black", [3, 0]),
  // KINGS
  new King("WK", "white", [4, 7]),
  new King("BK", "black", [4, 0])
];
