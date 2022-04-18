import { Input, vec, Vector } from "excalibur";
import { Game } from ".";
import { Piece } from "./actors/piece";
import { Move } from "./move";
import { Board } from "./scenes/board";

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
        this.legalMoves = undefined;
    }

    onChessAction(event: Input.PointerEvent): void {
        const eventPos = vec(Math.floor(event.worldPos.x / 75), Math.floor(event.worldPos.y / 75));

        if (this.activePiecePos && this.activePieceType) {
            if (!this.activePiecePos.equals(eventPos)) {
                const legalMoves: Move[] = this.legalMoves;
                let madeMove = false;

                legalMoves.forEach(move => {
                    // We can't use a usual break here, so have a flag for when we have made our move
                    if (!madeMove && move.end.equals(eventPos)) {
                        this.board.movePiece(this.activePiecePos, eventPos);
                
                        this.activePiecePos = undefined;
                        this.activePieceType = "";
                        this.legalMoves = undefined;

                        madeMove = true;
                    }
                });
            } else {
                this.activePiecePos = undefined;
                this.activePieceType = "";
                this.legalMoves = undefined;
            }
        } else {
            const pieceType = this.board.getPieceType(eventPos);

            if (pieceType != "") {
                this.activePieceType = pieceType;
                this.activePiecePos = eventPos;
                this.legalMoves = Piece.getLegalMoves(this.board, this.activePiecePos);
            }
        }
        
        this.board.resetMoveLocationActors(this.legalMoves);
    }
}