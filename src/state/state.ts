import {vec} from 'excalibur';
import {BoardState} from './boardState';
import {Move} from '../helper/move';
import {Piece, PieceSide, PieceType} from '../helper/piece';
import {Board} from '../scenes/board';

/**
 * Contains the various actions that can happen during a the end of a turn,
 * such as a check, checkmate, draw, or other important event. Only for
 * displaying the current state of the game to the user.
 */
export enum StateInfoOptions {
  whiteMove,
  blackMove,
  whiteCheck,
  blackCheck,
  crossCheck,
  whiteCheckmate,
  blackCheckmate,
  draw,
  stalemate,
}

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

  get boardState(): BoardState {
    return this._boardState;
  }

  pieceMoved(): void {
    Board.get().resetPieceActors();
    this.turnMade();
  }

  turnMade(): void {
    const state: StateInfoOptions[] = [];

    this._playerTurn =
      this._playerTurn == PieceSide.white ? PieceSide.black : PieceSide.white;

    if (this._playerTurn == PieceSide.white) {
      state.push(StateInfoOptions.whiteMove);
    } else {
      state.push(StateInfoOptions.blackMove);
    }

    this._turnCount++;

    // TODO: draws

    this._check = this.kingInCheck(this._boardState);
    if (this._check != undefined) {
      // Check
      if (this._check == PieceSide.white) {
        state.push(StateInfoOptions.whiteCheck);
      } else if (this._check == PieceSide.black) {
        state.push(StateInfoOptions.blackCheck);
      } else if (this._check == true) {
        state.push(StateInfoOptions.crossCheck);
      }

      // Checkmate
      // TODO: Have this actually end the game
      if (this.inCheckmate(this._boardState, PieceSide.white)) {
        state.push(StateInfoOptions.whiteCheckmate);
      } else if (this.inCheckmate(this._boardState, PieceSide.black)) {
        state.push(StateInfoOptions.blackCheckmate);
      }
    }

    Board.get().updateInfo(state);
  }

  inCheckmate(state: BoardState, ourColor: PieceSide): boolean {
    // Look through all possible moves that we can make
    const ourLegalMoves: Move[] = [];

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = state.getPiece(vec(x, y));

        if (piece == null || piece.side != ourColor) {
          continue;
        }

        const legalMoves = Piece.getLegalMoves(state, vec(x, y));
        ourLegalMoves.push(...legalMoves);
      }
    }

    // If there is even one possible move to get us out of check, we are not in checkmate
    for (const ourMove of ourLegalMoves) {
      const isCheck = this.kingInCheckWithMove(state, ourMove);
      // FIXME: Cannot handle results of function
      if (isCheck == undefined) {
        return false;
      } else if (isCheck == PieceSide.white || isCheck == PieceSide.black) {
        if (isCheck != ourColor) {
          return false;
        }
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

    let whiteCheck = false;
    let blackCheck = false;

    for (const move of allLegalMoves) {
      if (move.end.equals(whiteKingPos)) {
        // Make sure the black king isn't the one checking the white king
        if (
          !(
            move.piece.side != PieceSide.black &&
            move.piece.type != PieceType.king
          )
        ) {
          whiteCheck = true;
        }
      }

      if (move.end.equals(blackKingPos)) {
        // Make sure the white king isn't the one checking the black king
        if (
          !(
            move.piece.side != PieceSide.white &&
            move.piece.type != PieceType.king
          )
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

  kingInCheckWithMove(
    state: BoardState,
    possibleMove: Move,
  ): boolean | PieceSide {
    const newState = new BoardState(state);
    newState.movePiece(possibleMove);

    const kingCheckResult = this.kingInCheck(newState);

    if (kingCheckResult == true) {
      return true;
    } else if (
      kingCheckResult == PieceSide.black ||
      kingCheckResult == PieceSide.white
    ) {
      return kingCheckResult;
    } else {
      return false;
    }
  }

  // Singleton creation and getting
  static init(ourPlayer: PieceSide): void {
    this._state = new State(ourPlayer);
  }

  static stateInitialized(): boolean {
    return this._state != undefined;
  }

  static get(): State {
    if (!this._state) {
      throw new Error('Trying to get State when it has not been created.');
    }

    return this._state;
  }
}
