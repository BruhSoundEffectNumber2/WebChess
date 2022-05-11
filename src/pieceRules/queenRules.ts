import {Vector} from 'excalibur';
import {BoardState} from '../state/boardState';
import {Move} from '../helper/move';
import {BishopRules} from './bishopRules';
import {BasePieceRules} from './basePieceRules';
import {RookRules} from './rookRules';

export class QueenRules extends BasePieceRules {
  getLegalMoves(board: BoardState, pos: Vector): Move[] {
    /**
     * The queen combines the traits of the rook and bishop.
     */

    const moves: Move[] = [];

    return moves.concat(
      new RookRules().getLegalMoves(board, pos),
      new BishopRules().getLegalMoves(board, pos),
    );
  }
}
