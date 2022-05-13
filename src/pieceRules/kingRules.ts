import {vec, Vector} from 'excalibur';
import {BoardState} from '../state/boardState';
import {Move} from '../helper/move';
import {BasePieceRules} from './basePieceRules';

export class KingRules extends BasePieceRules {
  getLegalMoves(board: BoardState, pos: Vector): Move[] {
    /**
     * The King can move one space in every direction.
     */

    const moves: Move[] = [];

    const ourPiece = board.getPiece(pos);
    if (ourPiece == undefined) {
      throw new Error('Trying to get the legal moves of an empty space.');
    }

    // Temp variables for possible moves
    let optionPos;

    // Moving one up
    optionPos = pos.add(vec(0, -1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Moving one down
    optionPos = pos.add(vec(0, 1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Moving one left
    optionPos = pos.add(vec(-1, 0));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Moving one right
    optionPos = pos.add(vec(1, 0));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Moving one up/left
    optionPos = pos.add(vec(-1, -1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Moving one up/right
    optionPos = pos.add(vec(1, -1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Moving one down/left
    optionPos = pos.add(vec(-1, 1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Moving one down/right
    optionPos = pos.add(vec(1, 1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    return moves;
  }
}
