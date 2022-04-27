import { Board } from "./scenes/board";

export class State {
    static state: State;

    // Which player is making their turn
    public playerTurn: number;
    // How many turns have been made
    public turnCount: number;
    // Is any king in check (0: No, 1: White in check, 2: Black in check)
    public check = 0;

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

        // TODO: draws

        this.check = this.board.kingInCheck();
        if (this.check != 0) {
            this.checkBehavior();
        }
    }

    private checkBehavior(): void {
        /**
         * We have 3 ways to break a check.
         * 1. The checking piece can be captured.
         * 2. The king can move out of the way.
         * 3. Another friendly piece can block the checking piece.
         * If there are no ways to break the check, then it's a checkmate and the game is over.
         */
    }

    private checkMate(): void {
        // TODO: winning
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