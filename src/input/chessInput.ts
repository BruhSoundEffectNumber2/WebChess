import {Input, vec, Vector} from 'excalibur';
import {Game} from '..';
import {PieceActor} from '../actors/pieceActor';
import {Move} from '../helper/move';
import {Board} from '../scenes/board';
import {State} from '../state/state';

export class ChessInput {
  private activePieceType: string;
  private activePiecePos: Vector;

  private game: Game;
  private board: Board;
  private legalMoves: Move[];

  constructor(game: Game) {
    this.game = game;
    this.board = game.board;
    this.legalMoves = [];
  }

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
    if (State.getState().ourPlayer != State.getState().playerTurn) {
      return;
    }

    if (
      this.activePiecePos != vec(-1, -1) &&
      this.activePieceType &&
      State.getState().boardState.getPieceColor(eventPos) !=
        State.getState().boardState.getPieceColor(this.activePiecePos)
    ) {
      let madeMove = false;

      this.legalMoves.forEach((move) => {
        /**
         * We can't use a usual break here, so have a flag for when
         * we have made our move
         */
        if (!madeMove && move.end.equals(eventPos)) {
          State.getState().boardState.movePiece(
            this.activePiecePos,
            eventPos,
            false,
            true,
          );

          this.activePiecePos = vec(-1, -1);
          this.activePieceType = '';
          this.legalMoves = [];

          madeMove = true;
        }
      });
    } else {
      const pieceType = State.getState().boardState.getPieceType(eventPos);

      if (pieceType != '') {
        if (
          State.getState().boardState.getPieceColor(eventPos) !=
          State.getState().playerTurn
        ) {
          return;
        }

        this.activePieceType = pieceType;
        this.activePiecePos = eventPos;

        /**
         * Check through all legal moves given by the piece so
         * they don't result in a check
         */
        this.legalMoves = [];
        const possibleMoves = PieceActor.getLegalMoves(
          State.getState().boardState,
          this.activePiecePos,
        );

        for (const move of possibleMoves) {
          if (
            !State.getState().kingInCheckWithMove(
              State.getState().boardState,
              move,
            )
          ) {
            this.legalMoves.push(move);
          }
        }
      }
    }

    this.board.resetMoveLocationActors(this.legalMoves);
  }
}
