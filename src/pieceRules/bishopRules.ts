import {vec, Vector} from 'excalibur';
import {BoardState} from '../state/boardState';
import {Move} from '../helper/move';
import {BasePieceRules} from './basePieceRules';
import { PieceSide } from '../helper/piece';

export class BishopRules extends BasePieceRules {
  override getLegalMoves(board: BoardState, pos: Vector): Move[] {
    /**
     * The bishop can move diagonally in any direction until it is
     * blocked by a friendly piece or it captures an enemy piece.
     */

    const moves: Move[] = [];

    const ourPiece = board.getPiece(pos);

    if (ourPiece == undefined) {
      throw new Error('Trying to get the legal moves of an empty space.');
    }

    // Temp variables for possible moves
    let optionPos;

    // Moving up/right
    if (pos.x != 7 && pos.y != 0) {
      for (let i = 1; i < 8; i++) {
        optionPos = pos.add(vec(i, -i));

        // Stop if our possible move goes outside the board
        if (optionPos.x == 8 || optionPos.y == -1) {
          break;
        }

        if (this.isOptionValid(board, pos, optionPos)) {
          moves.push(new Move(ourPiece, pos, optionPos));

          if (board.getPiece(optionPos))
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
