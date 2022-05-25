import {Vector} from 'excalibur';
import {BasePieceRules} from '../pieceRules/basePieceRules';
import {BishopRules} from '../pieceRules/bishopRules';
import {KingRules} from '../pieceRules/kingRules';
import {KnightRules} from '../pieceRules/knightRules';
import {PawnRules} from '../pieceRules/pawnRules';
import {QueenRules} from '../pieceRules/queenRules';
import {RookRules} from '../pieceRules/rookRules';
import {BoardState} from '../state/boardState';
import {Move} from './move';

export enum PieceType {
  'king',
  'queen',
  'rook',
  'bishop',
  'knight',
  'pawn',
}

export enum PieceSide {
  'white',
  'black',
}

export class Piece {
  private _pos: Vector;
  private _type: PieceType;
  private _side: PieceSide;

  constructor(pos: Vector, type: PieceType, side: PieceSide) {
    this._pos = pos;
    this._type = type;
    this._side = side;
  }

  public get type(): PieceType {
    return this._type;
  }

  public get side(): PieceSide {
    return this._side;
  }

  public get pos(): Vector {
    return this._pos;
  }

  public set pos(pos: Vector) {
    if (pos.x >= 0 && pos.x <= 7) {
      if (pos.y >= 0 && pos.y <= 7) {
        this._pos = pos;
        return;
      }
    }

    console.warn('Tried to set the position of a piece to an invalid value.');
  }

  static getLegalMoves(board: BoardState, pos: Vector): Move[] {
    // Make sure the space has a piece on it
    const piece = board.getPiece(pos);

    if (piece == undefined) {
      return [];
    }

    // Get the object that will give us the correct moves, then cast it to the parent
    const obj: BasePieceRules = (() => {
      switch (piece._type) {
        case PieceType.king:
          return new KingRules();
        case PieceType.queen:
          return new QueenRules();
        case PieceType.rook:
          return new RookRules();
        case PieceType.bishop:
          return new BishopRules();
        case PieceType.knight:
          return new KnightRules();
        case PieceType.pawn:
          return new PawnRules();
      }
    })();

    return obj.getLegalMoves(board, pos);
  }
}
