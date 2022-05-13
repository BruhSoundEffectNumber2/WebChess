import {Actor, Sprite, vec, Vector} from 'excalibur';
import {Piece, PieceSide, PieceType} from '../helper/piece';
import {Resources} from '../resources';

export class PieceActor extends Actor {
  private _piece: Piece;

  constructor(piece: Piece, boardPos: Vector) {
    super({
      width: 45,
      height: 45,
      anchor: Vector.Zero,
      pos: vec(boardPos.x * 75 + 15, boardPos.y * 75 + 15),
    });

    this._piece = piece;
  }

  override onInitialize(): void {
    this.graphics.use(this.getSprite());
  }

  private getSprite(): Sprite {
    if (this._piece.side == PieceSide.white) {
      return (() => {
        switch (this._piece.type) {
          case PieceType.king:
            return Resources.KW;
          case PieceType.queen:
            return Resources.QW;
          case PieceType.rook:
            return Resources.RW;
          case PieceType.bishop:
            return Resources.BW;
          case PieceType.knight:
            return Resources.NW;
          case PieceType.pawn:
            return Resources.PW;
        }
      })().toSprite();
    } else {
      return (() => {
        switch (this._piece.type) {
          case PieceType.king:
            return Resources.KB;
          case PieceType.queen:
            return Resources.QB;
          case PieceType.rook:
            return Resources.RB;
          case PieceType.bishop:
            return Resources.BB;
          case PieceType.knight:
            return Resources.NB;
          case PieceType.pawn:
            return Resources.PB;
        }
      })().toSprite();
    }
  }
}
