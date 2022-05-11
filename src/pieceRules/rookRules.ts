import {vec, Vector} from 'excalibur';
import {BoardState} from '../state/boardState';
import {Move} from '../helper/move';
import {BasePieceRules} from './basePieceRules';

export class RookRules extends BasePieceRules {
  getLegalMoves(board: BoardState, pos: Vector): Move[] {
    // TODO: Castling

    /**
     * The rook can move up, down, left, and right any distance.
     */

    const moves: Move[] = [];

    const ourPiece = board.getPiece(pos);
    if (ourPiece == undefined) {
      throw new Error('Trying to get the legal moves of an empty space.');
    }

    // Temp variables for possible moves
    let optionPos;

    // Moving up
    if (pos.y != 0) {
      for (let i = 1; i < 8; i++) {
        optionPos = pos.add(vec(0, -i));

        // Stop if our possible move goes outside the board
        if (optionPos.y == -1) {
          break;
        }

        if (this.isOptionValid(board, pos, optionPos)) {
          moves.push(new Move(ourPiece, pos, optionPos));

          if (board.getPiece(optionPos) != undefined) {
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

        if (this.isOptionValid(board, pos, optionPos)) {
          moves.push(new Move(ourPiece, pos, optionPos));

          if (board.getPiece(optionPos) != undefined) {
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

        if (this.isOptionValid(board, pos, optionPos)) {
          moves.push(new Move(ourPiece, pos, optionPos));

          if (board.getPiece(optionPos) != undefined) {
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

        if (this.isOptionValid(board, pos, optionPos)) {
          moves.push(new Move(ourPiece, pos, optionPos));

          if (board.getPiece(optionPos) != undefined) {
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
