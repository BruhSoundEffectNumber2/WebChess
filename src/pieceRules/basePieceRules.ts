import {Vector} from 'excalibur';
import {BoardState} from '../state/boardState';
import {Move} from '../helper/move';

export abstract class BasePieceRules {
  abstract getLegalMoves(board: BoardState, pos: Vector): Move[];

  /**
   * Checks that we can move into a possible position.
   */
  protected isOptionValid(board: BoardState, ourPos: Vector, optionPos: Vector): boolean {
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
