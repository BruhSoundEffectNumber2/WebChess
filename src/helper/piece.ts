import { Vector } from 'excalibur';
import {BoardState} from '../state/boardState';
import { Move } from './move';

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
    return this.pos;
  }

  public set pos(pos: Vector) {
    if (pos.x >= 0 && pos.x <= 7) {
      if (pos.y >= 0 && pos.y <= 7) {
        this._pos = pos;
      }
    }
  }

  static getLegalMoves(board: BoardState, pos: Vector): Move[] {
    return [];
  }
}
