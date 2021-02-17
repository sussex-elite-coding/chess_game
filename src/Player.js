class Player {
  constructor(name, colour, isActive) {
    this.name = name;
    this.colour = colour;
    this.isActive = isActive;
  }
}

export const playerOne = new Player("Player 1", "white", true);
export const playerTwo = new Player("Player 2", "black", false);

export default [playerOne, playerTwo];
