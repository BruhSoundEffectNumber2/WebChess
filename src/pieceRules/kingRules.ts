import {vec, Vector} from 'excalibur';
import {BoardState} from '../state/boardState';
import {Move} from '../helper/move';
import {PieceRule} from './pieceRule';

export class KingRules implements PieceRule {
  getLegalMoves(board: BoardState, pos: Vector): Move[] {
    /**
     * The King can move one space in every direction.
     */

    const moves: Move[] = [];

    const ourType = board.getPieceType(pos);
    const ourColor = board.getPieceColor(pos);

    // Temp variables for possible moves
    let optionColor;
    let optionPos;

    // Moving one up
    if (pos.y != 0) {
      optionPos = pos.add(vec(0, -1));
      optionColor = board.getPieceColor(optionPos);

      if (optionColor != ourColor) {
        moves.push(new Move(ourType, pos, optionPos));
      }
    }

    // Moving one down
    if (pos.y != 7) {
      optionPos = pos.add(vec(0, 1));
      optionColor = board.getPieceColor(optionPos);

      if (optionColor != ourColor) {
        moves.push(new Move(ourType, pos, optionPos));
      }
    }

    // Moving one left
    if (pos.x != 0) {
      optionPos = pos.add(vec(-1, 0));
      optionColor = board.getPieceColor(optionPos);

      if (optionColor != ourColor) {
        moves.push(new Move(ourType, pos, optionPos));
      }
    }

    // Moving one right
    if (pos.x != 7) {
      optionPos = pos.add(vec(1, 0));
      optionColor = board.getPieceColor(optionPos);

      if (optionColor != ourColor) {
        moves.push(new Move(ourType, pos, optionPos));
      }
    }

    // Moving one up/left
    if (pos.x != 0 && pos.y != 0) {
      optionPos = pos.add(vec(-1, -1));
      optionColor = board.getPieceColor(optionPos);

      if (optionColor != ourColor) {
        moves.push(new Move(ourType, pos, optionPos));
      }
    }

    // Moving one up/right
    if (pos.x != 7 && pos.y != 0) {
      optionPos = pos.add(vec(1, -1));
      optionColor = board.getPieceColor(optionPos);

      if (optionColor != ourColor) {
        moves.push(new Move(ourType, pos, optionPos));
      }
    }

    // Moving one down/left
    if (pos.x != 0 && pos.y != 7) {
      optionPos = pos.add(vec(-1, 1));
      optionColor = board.getPieceColor(optionPos);

      if (optionColor != ourColor) {
        moves.push(new Move(ourType, pos, optionPos));
      }
    }

    // Moving one down/right
    if (pos.x != 7 && pos.y != 7) {
      optionPos = pos.add(vec(1, 1));
      optionColor = board.getPieceColor(optionPos);

      if (optionColor != ourColor) {
        moves.push(new Move(ourType, pos, optionPos));
      }
    }

    return moves;
  }
}
