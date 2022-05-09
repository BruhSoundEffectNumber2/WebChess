import {
  Actor,
  Color,
  Font,
  FontUnit,
  Label,
  Rectangle,
  TextAlign,
  vec,
  Vector,
} from 'excalibur';
import {Board} from '../scenes/board';
import {State} from '../state';

export class InfoPanel {
  private board: Board;
  private state: State;

  // The base background
  private bg: Actor;

  // Text to display what is happening in the game
  private stateText: Label;

  constructor(board: Board) {
    this.board = board;
    this.state = State.getState();

    // Create the background for game information
    this.bg = new Actor({
      anchor: Vector.Zero,
      pos: vec(600, 0),
    });

    this.bg.graphics.use(
      new Rectangle({
        color: Color.fromRGB(45, 45, 45),
        width: 300,
        height: 600,
      }),
    );

    this.board.add(this.bg);

    // Create label for game state
    this.stateText = new Label({
      text: 'Test',
      pos: vec(750, 24),
      font: new Font({
        family: 'arial',
        size: 24,
        unit: FontUnit.Px,
        color: Color.White,
        textAlign: TextAlign.Center,
      }),
    });

    this.board.add(this.stateText);
    this.update();
  }

  update() {
    if (this.state.check != 0) {
      this.stateText.text =
        (this.state.check == 1 ? 'White' : 'Black') + ' is in check.';
    } else {
      this.stateText.text =
        'It is ' +
        (this.state.playerTurn == 1 ? 'White\'s' : 'Black\'s') +
        ' turn.';
    }
  }
}
