import { Vector } from "excalibur";
import { Move } from "../move";
import { Board } from "../scenes/board";
import { BishopRules } from "./bishopRules";
import { PieceRule } from "./pieceRule";
import { RookRules } from "./rookRules";

export class QueenRules implements PieceRule {
    getLegalMoves(board: Board, pos: Vector): Move[] {

        /**
         * The queen combines the traits of the rook and bishop, and can
         * move in every direction.
         */
        
        const moves: Move[] = [];

        return moves.concat(new RookRules().getLegalMoves(board, pos), 
            new BishopRules().getLegalMoves(board, pos));
    }
}