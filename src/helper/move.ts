import {Vector} from 'excalibur';
import { Piece } from './piece';

export class Move {
  public _piece: Piece;
  public _start: Vector;
  public _end: Vector;

  constructor(piece: Piece, start: Vector, end: Vector) {
    this._piece = piece;
    this._start = start;
    this._end = end;
  }

  get piece(): Piece {
    return this._piece;
  }

  get start(): Vector {
    return this._start;
  }

  get end(): Vector {
    return this._end;
  }
}
