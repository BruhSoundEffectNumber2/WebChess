import {Input, vec} from 'excalibur';
import {Move} from '../helper/move';
import {Piece} from '../helper/piece';
import {playChessMovedSound} from '../resources';
import {Board} from '../scenes/board';
import {Network} from '../state/network';
import {State} from '../state/state';

export class ChessInput {
  static _chessInput: ChessInput | undefined;

  private _activePiece: Piece | null = null;
  private legalMoves: Move[] = [];

  onChessAction(event: Input.PointerEvent): void {
    const eventPos = vec(
      Math.floor(event.worldPos.x / 75),
      Math.floor(event.worldPos.y / 75),
    );

    // Make sure the event position is within the board
    if (eventPos.x < 0 || eventPos.x > 7 || eventPos.y < 0 || eventPos.y > 7) {
      return;
    }

    // We can only make a move if it's our turn to do it
    if (State.get().ourPlayer != State.get().playerTurn) {
      return;
    }

    if (
      this._activePiece &&
      (State.get().boardState.getPiece(eventPos) == undefined ||
        State.get().boardState.getPiece(eventPos)?.side !=
          this._activePiece.side)
    ) {
      let madeMove = false;

      this.legalMoves.forEach((move) => {
        /**
         * We can't use a usual break here, so have a flag for when
         * we have made our move. Have to double check that activePiece is not undefined.
         */
        if (!madeMove && move.end.equals(eventPos) && this._activePiece) {
          const move = new Move(
            this._activePiece,
            this._activePiece?.pos,
            eventPos,
          );

          State.get().boardState.movePiece(move);

          Network.get().sendMove(move);
          State.get().pieceMoved();

          playChessMovedSound();

          this._activePiece = null;
          this.legalMoves = [];

          madeMove = true;
        }
      });
    } else {
      const piece = State.get().boardState.getPiece(eventPos);

      if (piece != undefined) {
        if (piece.side != State.get().playerTurn) {
          return;
        }

        this._activePiece = State.get().boardState.getPiece(eventPos);

        /**
         * Check through all legal moves given by the piece so
         * they don't result in a check
         */
        this.legalMoves = [];
        const possibleMoves = Piece.getLegalMoves(
          State.get().boardState,
          this._activePiece!.pos,
        );

        // FIXME: Fix error of this not working (piece obj pos not updated?)
        for (const move of possibleMoves) {
          if (!State.get().kingInCheckWithMove(State.get().boardState, move)) {
            this.legalMoves.push(move);
          }
        }
      }
    }

    Board.get().resetMoveLocationActors(this.legalMoves);
  }

  static get(): ChessInput {
    if (this._chessInput == undefined) {
      this._chessInput = new ChessInput();
    }

    return this._chessInput;
  }
}
