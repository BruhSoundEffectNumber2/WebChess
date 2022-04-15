import { vec, Vector } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Game } from ".";
import { Board } from "./scenes/board";

export class ChessInput {
    // The currently selected piece
    private activePieceType: string;
    private activePiecePos: Vector;

    private game: Game;
    private board: Board;

    constructor(game: Game) {
        this.game = game;
        this.board = game.board;
    }

    onChessAction(event: PointerEvent): void {
        const eventPos = vec(Math.floor(event.worldPos.x / 75), Math.floor(event.worldPos.y / 75));

        if (this.activePiecePos && this.activePieceType) {
            this.board.movePiece(this.activePiecePos, eventPos);
            
            this.activePiecePos = undefined;
            this.activePieceType = "";
        } else {
            let pieceType = this.board.getPieceType(eventPos);

            if (pieceType != "") {
                this.activePieceType = pieceType;
                this.activePiecePos = eventPos;
            }
        }
    }
}