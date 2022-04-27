import { vec } from "excalibur";
import { Piece } from "./actors/piece";
import { BoardState } from "./boardState";
import { Move } from "./move";
import { Board } from "./scenes/board";

export class State {
    static state: State;

    // Which player is making their turn
    public playerTurn: number;
    // How many turns have been made
    public turnCount: number;
    // Is any king in check (0: No, 1: White in check, 2: Black in check)
    public check = 0;

    public board: Board;
    public boardState: BoardState;

    constructor(board: Board) {
        this.playerTurn = 1;
        this.turnCount = 0;
        this.board = board;
        this.boardState = new BoardState();
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

        this.check = this.kingInCheck();
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

    kingInCheck(): number {
        const allLegalMoves: Move[] = [];
        const whiteKingPos = this.boardState.getKingPos(1);
        const blackKingPos = this.boardState.getKingPos(2);

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const legalMoves = Piece.getLegalMoves(this.boardState, vec(x, y));

                if (legalMoves.length > 0) {
                    allLegalMoves.push(...legalMoves);
                }
            }
        }

        for (const move of allLegalMoves) {
            if (whiteKingPos != undefined) {
                if (move.end.equals(whiteKingPos)) {
                    // Make sure the other king isn't the one checking this king
                    if (move.piece != "kb") {
                        return 1;
                    }
                }
            }

            if (blackKingPos != undefined) {
                if (move.end.equals(blackKingPos)) {
                    // Make sure the other king isn't the one checking this king
                    if (move.piece != "kw") {
                        return 2;
                    }
                }
            }
        }

        return 0;
    }

    kingInCheckWithMove(possibleMove: Move): boolean {
        return false;
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