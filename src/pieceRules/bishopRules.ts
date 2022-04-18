import { vec, Vector } from "excalibur";
import { Move } from "../move";
import { Board } from "../scenes/board";
import { PieceRule } from "./pieceRule";

export class BishopRules implements PieceRule {
    getLegalMoves(board: Board, pos: Vector): Move[] {
        /**
         * The bishop can move diagonally in any direction until it is
         * blocked by a friendly piece or it captures an enemy piece.
         */

        const moves: Move[] = [];

        const ourType = board.getPieceType(pos);
        const ourColor = board.getPieceColor(pos);
        
        // Temp variables for possible moves
        let optionColor;
        let optionPos;

        // Moving up/right
        if (pos.x != 7 && pos.y != 0) {
            for (let i = 1; i < 8; i++) {
                optionPos = pos.add(vec(i, -i));
    
                // Stop if our possible move goes outside the board
                if (optionPos.x == 8 || optionPos.y == -1) {
                    break;
                }

                optionColor = board.getPieceColor(optionPos);

                if (optionColor != ourColor) {
                    moves.push(new Move(ourType, pos, optionPos));

                    // Once we hit an enemy piece, we can't go any further
                    if (optionColor != 0) {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        // Moving up/left
        if (pos.x != 0 && pos.y != 0) {
            for (let i = 1; i < 8; i++) {
                optionPos = pos.add(vec(-i, -i));
    
                // Stop if our possible move goes outside the board
                if (optionPos.x == -1 || optionPos.y == -1) {
                    break;
                }

                optionColor = board.getPieceColor(optionPos);

                if (optionColor != ourColor) {
                    moves.push(new Move(ourType, pos, optionPos));

                    // Once we hit an enemy piece, we can't go any further
                    if (optionColor != 0) {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        // Moving down/left
        if (pos.x != 0 && pos.y != 7) {
            for (let i = 1; i < 8; i++) {
                optionPos = pos.add(vec(-i, i));
    
                // Stop if our possible move goes outside the board
                if (optionPos.x == -1 || optionPos.y == 8) {
                    break;
                }

                optionColor = board.getPieceColor(optionPos);

                if (optionColor != ourColor) {
                    moves.push(new Move(ourType, pos, optionPos));

                    // Once we hit an enemy piece, we can't go any further
                    if (optionColor != 0) {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        // Moving down/right
        if (pos.x != 7 && pos.y != 7) {
            for (let i = 1; i < 8; i++) {
                optionPos = pos.add(vec(i, i));
    
                // Stop if our possible move goes outside the board
                if (optionPos.x == 8 || optionPos.y == 8) {
                    break;
                }

                optionColor = board.getPieceColor(optionPos);

                if (optionColor != ourColor) {
                    moves.push(new Move(ourType, pos, optionPos));

                    // Once we hit an enemy piece, we can't go any further
                    if (optionColor != 0) {
                        break;
                    }
                } else {
                    break;
                }
            }
        }

        return moves;
    }
}