import {Vector, vec} from 'excalibur';
import {Move} from '../helper/move';
import {Piece, PieceSide, PieceType} from '../helper/piece';

export class BoardState {
  private pieces: Piece[][] | null[][];
  // For the sake of space, we represent the initial conditions of the board as a string array
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
      // Deep copy the original BoardState to prevent reference weirdness
      this.pieces = [];

      for (let x = 0; x < copyFrom.pieces.length; x++) {
        this.pieces[x] = [];
        for (let y = 0; y < copyFrom.pieces[x]!.length; y++) {
          const origPiece = copyFrom.pieces[x]![y];
          if (origPiece == null) {
            this.pieces[x]![y] = null;
          } else {
            this.pieces[x]![y] = new Piece(
              origPiece.pos,
              origPiece.type,
              origPiece.side,
            );
          }
        }
      }
    } else {
      this.pieces = [];

      // Loop through all 2d array of starting pieces as strings, then convert to objects
      for (let x = 0; x < 8; x++) {
        this.pieces[x] = [];
        for (let y = 0; y < 8; y++) {
          const string = this.startingStringPieces[x]![y];

          // Check for empty space
          if (string == '') {
            continue;
          }

          // Lambda expressions to allow us to directly assign the result of a switch to a const
          const pieceType = (() => {
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
          })();

          const pieceSide = (() => {
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
          })();

          this.pieces[x]![y] = new Piece(vec(x, y), pieceType, pieceSide);
        }
      }
    }
  }

  getPiece(pos: Vector): Piece | null {
    if (pos.x < this.pieces.length || pos.x >= 0) {
      if (pos.y < this.pieces[pos.x]!.length && pos.y >= 0) {
        return this.pieces[pos.x]![pos.y]!;
      }
    }

    throw new Error('Trying to get piece type from outside the board.');
  }

  movePiece(move: Move): void {
    const piece = this.pieces[move.start.x]![move.start.y]!;

    this.pieces[move.start.x]![move.start.y] = null;
    this.pieces[move.end.x]![move.end.y] = piece;

    piece.pos = vec(move.end.x, move.end.y);
  }

  getKingPos(side: PieceSide): Vector {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const pos = vec(x, y);
        const piece = this.getPiece(pos);

        if (piece == null) {
          continue;
        }

        if (piece.type == PieceType.king) {
          if (piece.side == side) {
            return pos;
          }
        }
      }
    }

    throw new Error('Could not find a king on the board. One should be here.');
  }
}
