import { Input, vec, Vector } from "excalibur";
import { Game } from ".";
import { Piece } from "./actors/piece";
import { Move } from "./move";
import { Board } from "./scenes/board";
import { State } from "./state";

export class ChessInput {
    // The currently selected piece
    private activePieceType: string;
    private activePiecePos: Vector;

    private game: Game;
    private board: Board;
    private legalMoves: Move[];

    constructor(game: Game) {
        this.game = game;
        this.board = game.board;
        this.legalMoves = [];
    }

    onChessAction(event: Input.PointerEvent): void {
        const eventPos = vec(Math.floor(event.worldPos.x / 75), Math.floor(event.worldPos.y / 75));

        // Make sure the event position is within the board
        if (eventPos.x < 0 || eventPos.x > 7 || eventPos.y < 0 || eventPos.y > 7) {
            return;
        }

        if (this.activePiecePos != vec(-1, -1) && this.activePieceType && 
            this.board.getPieceColor(eventPos) != this.board.getPieceColor(this.activePiecePos)) {
            const legalMoves: Move[] = this.legalMoves;
            let madeMove = false;

            legalMoves.forEach(move => {
                // We can't use a usual break here, so have a flag for when we have made our move
                if (!madeMove && move.end.equals(eventPos)) {
                    this.board.movePiece(this.activePiecePos, eventPos);
            
                    this.activePiecePos = vec(-1, -1);
                    this.activePieceType = "";
                    this.legalMoves = [];

                    madeMove = true;
                }
            });
        } else {
            const pieceType = this.board.getPieceType(eventPos);

            if (pieceType != "") {
                if (this.board.getPieceColor(eventPos) != State.getState().playerTurn) {
                    return;
                }

                this.activePieceType = pieceType;
                this.activePiecePos = eventPos;
                this.legalMoves = Piece.getLegalMoves(this.board, this.activePiecePos);
            }
        }
        
        this.board.resetMoveLocationActors(this.legalMoves);
    }
}