import {vec, Vector} from 'excalibur';
import {BoardState} from '../boardState';
import {Move} from '../move';
import {PieceRule} from './pieceRule';

export class KnightRules implements PieceRule {
  getLegalMoves(board: BoardState, pos: Vector): Move[] {
    const moves: Move[] = [];
    const ourType = board.getPieceType(pos);

    let optionPos: Vector;

    // One left, two up
    optionPos = pos.add(vec(-1, -2));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourType, pos, optionPos));
    }

    // One right, two up
    optionPos = pos.add(vec(1, -2));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourType, pos, optionPos));
    }

    // Two left, one up
    optionPos = pos.add(vec(-2, -1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourType, pos, optionPos));
    }

    // Two right, one up
    optionPos = pos.add(vec(2, -1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourType, pos, optionPos));
    }

    // One left, two down
    optionPos = pos.add(vec(-1, 2));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourType, pos, optionPos));
    }

    // One right, two down
    optionPos = pos.add(vec(1, 2));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourType, pos, optionPos));
    }

    // Two left, one down
    optionPos = pos.add(vec(-2, 1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourType, pos, optionPos));
    }

    // Two right, one down
    optionPos = pos.add(vec(2, 1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourType, pos, optionPos));
    }

    return moves;
  }

  isOptionValid(board: BoardState, ourPos: Vector, optionPos: Vector): boolean {
    // Check that the option will be within the board
    if (
      optionPos.x < 0 ||
      optionPos.x > 7 ||
      optionPos.y < 0 ||
      optionPos.y > 7
    ) {
      return false;
    }

    const ourColor = board.getPieceColor(ourPos);
    const optionColor = board.getPieceColor(optionPos);

    return ourColor != optionColor;
  }
}
