import {vec, Vector} from 'excalibur';
import {BoardState} from '../state/boardState';
import {Move} from '../helper/move';
import {BasePieceRules} from './basePieceRules';
import {PieceSide} from '../helper/piece';

export class PawnRules extends BasePieceRules {
  getLegalMoves(board: BoardState, pos: Vector): Move[] {
    // TODO: moving 2 spaces in first move/en passent

    /**
     * The pawn can move 1 space towards the other color,
     * or one space diagonally towards the other color if an enemy
     * piece is occupying it.
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

    // Moving down
    optionPos = pos.add(vec(0, 1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Moving down up/left
    optionPos = pos.add(vec(-1, 1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    // Moving down up/right
    optionPos = pos.add(vec(1, 1));
    if (this.isOptionValid(board, pos, optionPos)) {
      moves.push(new Move(ourPiece, pos, optionPos));
    }

    return moves;
  }

  protected override isOptionValid(
    board: BoardState,
    ourPos: Vector,
    optionPos: Vector,
  ): boolean {
    // Check that the option will be within the board
    if (
      optionPos.x < 0 ||
      optionPos.x > 7 ||
      optionPos.y < 0 ||
      optionPos.y > 7
    ) {
      return false;
    }

    const ourPiece = board.getPiece(ourPos);
    const optionPiece = board.getPiece(optionPos);
    const posDif = optionPos.sub(ourPos);

    // TODO: En passent, two spaces on first move

    if (posDif.y == (ourPiece?.side == PieceSide.white ? -1 : 1)) {
      if (posDif.x == 0) {
        if (optionPiece == undefined) {
          return true;
        }
      } else {
        if (optionPiece != undefined && optionPiece.side != ourPiece?.side) {
          return true;
        }
      }
    }

    return false;
  }
}
