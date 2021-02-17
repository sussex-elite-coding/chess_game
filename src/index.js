import "./styles.css";
import { blackSquares } from "./blackSquares";
import drawPieces, { allPieces, coordsFromIndex } from "./drawPieces";
import players from "./Player";

export const board = document.createElement("div");
board.classList.add("chessBoard");

export const gameInfo = document.createElement("div");
gameInfo.classList.add("gameInfo");

function createSquare(colour, index) {
  const square = document.createElement("div");
  square.classList.add("square", colour);
  square.dataset.index = index;
  board.appendChild(square);
}

function selectSquare(node) {
  const piece = allPieces.find((piece) => piece.id === node.dataset.id);
  const activePlayer = players.find((player) => player.isActive);

  if (piece && piece.colour === activePlayer.colour) {
    clearSelection();
    node.parentElement.classList.add("selectedSquare");

    const possibleMoves = piece.getPossibleMoves();
    possibleMoves.forEach((move) => {
      board.childNodes[move].classList.add("possibleMoves");
      board.childNodes[move].dataset.pieceId = piece.id;
    });
  } else if (
    node.classList.contains("possibleMoves") ||
    node.parentElement?.classList.contains("possibleMoves")
  ) {
    node.parentElement?.classList.contains("possibleMoves")
      ? movePiece(node.parentElement)
      : movePiece(node);
    clearSelection();
  } else {
    clearSelection();
  }
}

function movePiece(node) {
  // Get coords of clicked square
  const nodeIndex = node.dataset.index;
  const nodeCoords = coordsFromIndex(nodeIndex);
  // Select the piece and use the move method with the destination coords as input
  const pieceToMove = allPieces.find(
    (piece) => piece.id === node.dataset.pieceId
  );
  pieceToMove.setCurrentPos(nodeCoords);
  drawPieces(board);
  toggleActivePlayer();
  updateGameInfo();
}

function toggleActivePlayer() {
  players.forEach((player) => (player.isActive = !player.isActive));
}

function clearSelection() {
  board.childNodes.forEach((node) =>
    node.classList.remove("selectedSquare", "possibleMoves")
  );
}

function initialise() {
  for (let i = 1; i <= 64; i++) {
    if (blackSquares.includes(i)) {
      createSquare("black", i);
    } else {
      createSquare("white", i);
    }
  }
  drawPieces(board);
  board.addEventListener("click", (e) => {
    e.target.firstChild // square with piece
      ? selectSquare(e.target.firstChild)
      : selectSquare(e.target);
  });
  updateGameInfo();
}
initialise();

function outputCapturedPieces(colour) {
  const pieces = allPieces.filter((piece) => piece.colour === colour);
  const captured = pieces.map((piece) =>
    piece.isCaptured
      ? `<i class="${piece.icon} ${piece.colour}-piece" data-id="${piece.id}" data-colour="${piece.colour}"></i>&nbsp;`
      : ""
  );
  return captured.join("");
}

function updateGameInfo() {
  gameInfo.innerHTML = players
    .map(
      (player) =>
        `<div>
          <h3 data-active="${player.isActive}"><strong>${player.name} (${
          player.colour
        })</strong></h3>
          <p>Captured: ${outputCapturedPieces(
            player.colour === "white" ? "black" : "white"
          )}</p>
       </div>`
    )
    .join("");
}

document.getElementById("app").appendChild(board);
document.getElementById("app").appendChild(gameInfo);
