import {vec} from 'excalibur';
import {BoardState} from './boardState';
import {Move} from '../helper/move';
import {Piece, PieceSide, PieceType} from '../helper/piece';

export class State {
  private static _state: State | undefined = undefined;

  // Which player is making their turn
  private _playerTurn: PieceSide;
  // How many turns have been made
  private _turnCount: number;
  // Is any king in check (King in check, no check, cross check respectively)
  private _check: PieceSide | undefined | boolean = undefined;

  private _ourPlayer: PieceSide;
  private _boardState: BoardState;

  constructor(ourPlayer: PieceSide) {
    this._playerTurn = PieceSide.white;
    this._turnCount = 0;
    this._boardState = new BoardState();
    this._ourPlayer = ourPlayer;
  }

  get playerTurn(): PieceSide {
    return this._playerTurn;
  }

  get ourPlayer(): PieceSide {
    return this._ourPlayer;
  }

  get turnCount(): number {
    return this._turnCount;
  }

  turnMade(): void {
    this._playerTurn =
      this._playerTurn == PieceSide.white ? PieceSide.black : PieceSide.white;

    this._turnCount++;

    // TODO: draws

    this._check = this.kingInCheck(this._boardState);
    if (this._check != undefined) {
      if (this._check == true) {
        if (this.inCheckmate(this._boardState, PieceSide.white)) {
          console.log(this._check + ' in checkmate. Game over.');
        }

        if (this.inCheckmate(this._boardState, PieceSide.black)) {
          console.log(this._check + ' in checkmate. Game over.');
        }
      } else {
        if (this.inCheckmate(this._boardState, this._check as PieceSide)) {
          console.log(this._check + ' in checkmate. Game over.');
        }
      }
    }
  }

  inCheckmate(state: BoardState, ourColor: PieceSide): boolean {
    // Look through all possible moves that we can make
    const ourLegalMoves: Move[] = [];

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const legalMoves = Piece.getLegalMoves(state, vec(x, y));
        const piece = state.getPiece(vec(x, y));

        if (piece && piece.side == ourColor) {
          ourLegalMoves.push(...legalMoves);
        }
      }
    }

    // If there is even one possible move to get us out of check, we are not in checkmate
    for (const ourMove of ourLegalMoves) {
      if (!this.kingInCheckWithMove(state, ourMove)) {
        return false;
      }
    }

    return true;
  }

  kingInCheck(state: BoardState): undefined | PieceSide | boolean {
    const allLegalMoves: Move[] = [];
    const whiteKingPos = state.getKingPos(PieceSide.white);
    const blackKingPos = state.getKingPos(PieceSide.black);

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const legalMoves = Piece.getLegalMoves(state, vec(x, y));

        allLegalMoves.push(...legalMoves);
      }
    }

    let whiteCheck;
    let blackCheck;

    for (const move of allLegalMoves) {
      whiteCheck = false;
      blackCheck = false;

      if (move.end.equals(whiteKingPos)) {
        // Make sure the black king isn't the one checking the white king
        if (
          move.piece.side != PieceSide.black &&
          move.piece.type != PieceType.king
        ) {
          whiteCheck = true;
        }
      }

      if (move.end.equals(blackKingPos)) {
        // Make sure the white king isn't the one checking the black king
        if (
          move.piece.side != PieceSide.white &&
          move.piece.type != PieceType.king
        ) {
          blackCheck = true;
        }
      }
    }

    if (!whiteCheck && !blackCheck) {
      return undefined;
    } else if (whiteCheck != blackCheck) {
      return whiteCheck ? PieceSide.white : PieceSide.black;
    } else {
      return true;
    }
  }

  kingInCheckWithMove(state: BoardState, possibleMove: Move): boolean {
    const newState = new BoardState(state);
    newState.movePiece(possibleMove);

    const kingCheckResult = this.kingInCheck(newState);
    const ourColor = possibleMove.piece.side;

    if (kingCheckResult == true) {
      return true;
    } else if (
      kingCheckResult == PieceSide.black ||
      kingCheckResult == PieceSide.white
    ) {
      return kingCheckResult == ourColor;
    } else {
      return false;
    }
  }

  // Singleton creation and getting
  static init(ourPlayer: PieceSide): void {
    if (this._state) {
      throw new Error('Cannot create the state more than once.');
    }

    this._state = new State(ourPlayer);
  }

  static get(): State {
    if (!this._state) {
      throw new Error('Trying to get State when it has not been created.');
    }

    return this._state;
  }
}
