import { vec, Vector } from "excalibur";
import { BoardState } from "../boardState";
import { Move } from "../move";
import { PieceRule } from "./pieceRule";

export class RookRules implements PieceRule {
    getLegalMoves(board: BoardState, pos: Vector): Move[] {

        // TODO: Castling

        /**
         * The rook can move up, down, left, and right any distance.
         */

        const moves: Move[] = [];

        const ourType = board.getPieceType(pos);
        const ourColor = board.getPieceColor(pos);
        
        // Temp variables for possible moves
        let optionColor;
        let optionPos;

        // Moving up
        if (pos.y != 0) {
            for (let i = 1; i < 8; i++) {
                optionPos = pos.add(vec(0, -i));
    
                // Stop if our possible move goes outside the board
                if (optionPos.y == -1) {
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

        // Moving down
        if (pos.y != 7) {
            for (let i = 1; i < 8; i++) {
                optionPos = pos.add(vec(0, i));
    
                // Stop if our possible move goes outside the board
                if (optionPos.y == 8) {
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

        // Moving left
        if (pos.x != 0) {
            for (let i = 1; i < 8; i++) {
                optionPos = pos.add(vec(-i, 0));
    
                // Stop if our possible move goes outside the board
                if (optionPos.x == -1) {
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

        // Moving right
        if (pos.x != 7) {
            for (let i = 1; i < 8; i++) {
                optionPos = pos.add(vec(i, 0));
    
                // Stop if our possible move goes outside the board
                if (optionPos.x == 8) {
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