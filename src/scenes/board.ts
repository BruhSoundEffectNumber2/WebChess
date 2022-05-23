import {Actor, Color, Rectangle, Scene, vec, Vector} from 'excalibur';
import {Game} from '..';
import {MoveLocationActor} from '../actors/moveLocationActor';
import {PieceActor} from '../actors/pieceActor';
import {Move} from '../helper/move';
import {PieceSide} from '../helper/piece';
import {Network} from '../state/network';
import {State, StateInfoOptions} from '../state/state';
import {UIManager} from '../ui/uiManager';

export class Board extends Scene {
  static _board: Board | undefined = undefined;

  private pieceActors!: PieceActor[];
  private moveLocationActors!: MoveLocationActor[];

  private _info!: HTMLParagraphElement;

  override onActivate(): void {
    UIManager.get().sceneActivated('board');

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

    // Create UI elements
    const bg = document.createElement('div');
    bg.className = 'bg';

    this._info = document.createElement('p');
    this._info.className = 'info';
    this._info.textContent = 'Default Text Content';

    const buttonHolder = document.createElement('div');
    buttonHolder.className = 'button-holder';

    const surrender = document.createElement('button');
    surrender.className = 'surrender';
    surrender.textContent = 'Surrender';
    surrender.onclick = () => {
      UIManager.get().decisionPopup(
        'Are You Sure?',
        'Are you sure you want to surrender? The match will count as a loss.',
        'Go Back',
        () => {
          /* Don't surrender */
        },
        'Surrender',
        () => {
          Network.get().surrender();
        },
      );
    };

    const offerDraw = document.createElement('button');
    offerDraw.className = 'offerDraw';
    offerDraw.textContent = 'Offer Draw';
    offerDraw.onclick = () => {
      UIManager.get().playButtonClickAudio();
      Network.get().offerDraw();
    };

    UIManager.get().ui.appendChild(bg);
    bg.appendChild(this._info);
    bg.appendChild(buttonHolder);
    buttonHolder.appendChild(surrender);
    buttonHolder.appendChild(offerDraw);

    this.pieceActors = [];
    this.moveLocationActors = [];

    this.resetPieceActors();
  }

  override onDeactivate(): void {
    UIManager.get().sceneDeactivated('board');
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

  updateInfo(stateEnums: StateInfoOptions[]): void {
    this._info.textContent = '';
    
    for (const state of stateEnums) {
      switch (state) {
        case StateInfoOptions.whiteMove: {
          this._info.textContent += 'White to Move <br/>';
          break;
        }
        case StateInfoOptions.blackMove: {
          this._info.textContent += 'Black to Move <br/>';
          break;
        }
        default: {
          this._info.textContent += 'Invalid State Info <br/>';
          break;
        }
      }
    }
  }

  static get(): Board {
    if (this._board == undefined) {
      this._board = new Board();
    }

    return this._board;
  }

  static destroy(): void {
    if (Game.get().scenes['board'] == undefined) {
      return;
    }

    Game.get().removeScene('board');
  }
}
