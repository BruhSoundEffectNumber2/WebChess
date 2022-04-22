import { Board } from "./scenes/board";

export class State {
    static state: State;

    // Which player is making their turn
    public playerTurn: number;
    // How many turns have been made
    public turnCount: number;
    // Is any king in check (0: No, 1: White in check, 2: Black in check)
    public check: number;

    private board: Board;

    constructor(board: Board) {
        this.playerTurn = 1;
        this.turnCount = 0;
        this.board = board;
    }

    turnMade(): void {
        // Update the player whose turn it is
        if (this.playerTurn == 1) {
            this.playerTurn = 2;
        } else {
            this.playerTurn = 1;
        }

        this.turnCount++;
    }

    // Singleton creation and getting
    static initState(board: Board): void {
        if (this.state) {
            throw new Error("Cannot create the state more than once.");
        }

        this.state = new State(board);
    }

    static getState(): State {
        if (!this.state) {
            throw new Error("State has not been created.");
        }

        return this.state;
    }
}