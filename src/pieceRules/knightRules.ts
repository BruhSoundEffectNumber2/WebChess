import {vec, Vector} from 'excalibur';
import {BoardState} from '../state/boardState';
import {Move} from '../helper/move';
import {BasePieceRules} from './basePieceRules';

export class KnightRules extends BasePieceRules {
  getLegalMoves(board: BoardState, pos: Vector): Move[] {
    /**
     * The knight can move in an L-shaped pattern in every direction.
     */

    const moves: Move[] = [];

    const ourPiece = board.getPiece(pos);
    if (ourPiece == undefined) {
      throw new Error('Trying to get the legal moves of an empty space.');
    }

    // Temp variables for possible moves
    let optionPos;

    // One left, two up
    optionPos = pos.add(vec(-1, -2));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // One right, two up
    optionPos = pos.add(vec(1, -2));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Two left, one up
    optionPos = pos.add(vec(-2, -1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Two right, one up
    optionPos = pos.add(vec(2, -1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // One left, two down
    optionPos = pos.add(vec(-1, 2));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // One right, two down
    optionPos = pos.add(vec(1, 2));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Two left, one down
    optionPos = pos.add(vec(-2, 1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Two right, one down
    optionPos = pos.add(vec(2, 1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    return moves;
  }
}
