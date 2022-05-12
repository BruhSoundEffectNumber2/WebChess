import {Actor, Color, Rectangle, Scene, vec, Vector} from 'excalibur';
import {MoveLocationActor} from '../actors/moveLocationActor';
import {PieceActor} from '../actors/pieceActor';
import {Move} from '../helper/move';
import {State} from '../state/state';

export class Board extends Scene {
  static _board: Board | undefined = undefined;

  private pieceActors!: PieceActor[];
  private moveLocationActors!: MoveLocationActor[];

  override onInitialize(): void {
    // Rectangles for the board squares
    const lightSquare = new Rectangle({
      width: 75,
      height: 75,
      color: Color.fromHex('f3dab2'),
    });

    const darkSquare = new Rectangle({
      width: 75,
      height: 75,
      color: Color.fromHex('bd875e'),
    });

    // Create a checkerboard pattern of dark and light squares
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const light = (x + y) % 2 == 0;

        const actor = new Actor({
          width: 75,
          height: 75,
          pos: vec(x * 75, y * 75),
          anchor: Vector.Zero,
        });

        actor.graphics.use(light ? lightSquare : darkSquare);
        this.add(actor);
      }
    }

    this.pieceActors = [];
    this.moveLocationActors = [];

    this.resetPieceActors();
  }

  resetPieceActors(): void {
    // TODO: Object pooling, more efficient way of moving pieces
    this.pieceActors.forEach((piece) => {
      this.remove(piece);
    });

    this.pieceActors = [];

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = State.get().boardState.getPiece(vec(x, y));

        // For when a space is not occupied by a piece
        if (piece == undefined) {
          continue;
        }

        const actor = new PieceActor(piece, vec(x, y));
        this.add(actor);
        this.pieceActors.push(actor);
      }
    }
  }

  resetMoveLocationActors(moves: Move[]): void {
    this.moveLocationActors.forEach((actor) => {
      this.remove(actor);
    });

    this.moveLocationActors = [];

    if (moves == undefined) {
      return;
    }

    moves.forEach((move) => {
      const actor = new MoveLocationActor(move.end);
      this.add(actor);
      this.moveLocationActors.push(actor);
    });
  }

  static get(): Board {
    if (this._board == undefined) {
      this._board = new Board();
    }

    return this._board;
  }
}
