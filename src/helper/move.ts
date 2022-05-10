import {Vector} from 'excalibur';
import { Piece } from './piece';

export class Move {
  public piece: Piece;
  public start: Vector;
  public end: Vector;

  constructor(piece: Piece, start: Vector, end: Vector) {
    this.piece = piece;
    this.start = start;
    this.end = end;
  }
}
