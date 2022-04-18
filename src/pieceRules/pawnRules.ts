import { vec, Vector } from "excalibur";
import { Move } from "../move";
import { Board } from "../scenes/board";
import { PieceRule } from "./pieceRule";

export class PawnRules implements PieceRule {
    getLegalMoves(board: Board, pos: Vector): Move[] {
        // TODO: moving 2 spaces in first move/en passent
        
        /*
        * The pawn can move 1 space towards the other color,
        * or one space diagonally towards the other color if an enemy
        * piece is occupying it.
        */

        const moves: Move[] = [];

        const ourType = board.getPieceType(pos);
        const ourColor = board.getPieceColor(pos);
        
        // Temp variables for possible moves
        let optionColor;
        let optionType;
        let optionPos;

        // Moving one up
        if (pos.y != 0) {
            optionPos = pos.add(vec(0, -1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 0 && ourColor == 1) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        // Moving one up/left
        if (pos.y != 0 && pos.x != 0) {
            optionPos = pos.add(vec(-1, -1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 2 && ourColor == 1) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        // Moving one up/right
        if (pos.y != 0 && pos.x != 7) {
            optionPos = pos.add(vec(1, -1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 2 && ourColor == 1) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        // Moving down
        if (pos.y != 7) {
            optionPos = pos.add(vec(0, 1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 0 && ourColor == 2) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        // Moving down up/left
        if (pos.y != 7 && pos.x != 0) {
            optionPos = pos.add(vec(-1, 1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 1 && ourColor == 2) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        // Moving down up/right
        if (pos.y != 7 && pos.x != 7) {
            optionPos = pos.add(vec(1, 1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 1 && ourColor == 2) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        return moves;
    }
}