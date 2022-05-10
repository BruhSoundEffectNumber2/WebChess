import {Vector, vec} from 'excalibur';
import {Move} from '../helper/move';
import {Piece, PieceSide, PieceType} from '../helper/piece';
import {State} from './state';

export class BoardState {
  private pieces: Piece[][];
  private readonly startingStringPieces = [
    ['br', 'bp', '', '', '', '', 'wp', 'wr'],
    ['bn', 'bp', '', '', '', '', 'wp', 'wn'],
    ['bb', 'bp', '', '', '', '', 'wp', 'wb'],
    ['bq', 'bp', '', '', '', '', 'wp', 'wk'],
    ['bk', 'bp', '', '', '', '', 'wp', 'wq'],
    ['bb', 'bp', '', '', '', '', 'wp', 'wb'],
    ['bn', 'bp', '', '', '', '', 'wp', 'wn'],
    ['br', 'bp', '', '', '', '', 'wp', 'wr'],
  ];

  constructor(copyFrom?: BoardState) {
    if (copyFrom) {
      this.pieces = JSON.parse(JSON.stringify(copyFrom.pieces));
    } else {
      this.pieces = [];

      for (let x = 0; x < 8; x++) {
        this.pieces[x] = [];
        for (let y = 0; y < 8; y++) {
          // Typescript complains about a possible null object, so check with ?
          const string = this.startingStringPieces[x]?.[y];
          const pieceType = () => {
            switch (string?.charAt(1)) {
              case 'r':
                return PieceType.rook;
              case 'n':
                return PieceType.knight;
              case 'b':
                return PieceType.bishop;
              case 'q':
                return PieceType.queen;
              case 'k':
                return PieceType.king;
              case 'p':
                return PieceType.pawn;
              default:
                throw new Error(
                  'Starting piece string contained an invalid type character',
                );
            }
          };

          const pieceSide = () => {
            switch (string?.charAt(0)) {
              case 'w':
                return PieceSide.white;
              case 'b':
                return PieceSide.black;
              default:
                throw new Error(
                  'Starting piece string contained an invalid side character',
                );
            }
          };

          /**
           * Non-null assertion weirdness to make typescript happy, even
           * though we can know that we created the array.
           */
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.pieces[x]![y] = new Piece(vec(x, y), pieceType(), pieceSide());
        }
      }
    }
  }

  getPieceType(pos: Vector): string {
    return this.pieces[pos.y][pos.x];
  }

  // Gets color of piece at pos. 0: empty, 1: white, 2: black
  getPieceColor(pos: Vector): number {
    const type = this.getPieceType(pos);

    if (type == '') {
      return 0;
    } else if (type.charAt(1) == 'w') {
      return 1;
    } else {
      return 2;
    }
  }

  movePiece(start: Vector, end: Vector, virtual = false, network = true): void {
    // Make sure a piece is there to be moved
    if (this.pieces[start.y][start.x] == '') {
      return;
    }

    // TODO: Have more logic for piece capturing
    const pieceType = this.pieces[start.y][start.x];

    this.pieces[start.y][start.x] = '';
    this.pieces[end.y][end.x] = pieceType;

    if (!virtual) {
      State.getState().board.resetPieceActors();
      State.getState().turnMade();
      State.getState().board.game.infoPanel.update();
    }

    if (network) {
      State.getState().turnMadeNetwork(new Move(pieceType, start, end));
    }
  }

  getKingPos(color: number): Vector | undefined {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const type = this.getPieceType(vec(x, y));

        if (type.charAt(0) == 'k') {
          if (this.getPieceColor(vec(x, y)) == color) {
            return vec(x, y);
          }
        }
      }
    }
  }
}
