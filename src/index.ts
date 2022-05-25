// The stylesheet has to be imported into index so it can be found by Webpack
import './styles/main.scss';
import './styles/mainMenu.scss';
import './styles/board.scss';

import {DisplayMode, Engine, Input, Loader} from 'excalibur';
import {ChessInput} from './input/chessInput';
import {Resources} from './resources';
import {Board} from './scenes/board';
import {State, StateInfoOptions} from './state/state';
import {MainMenu} from './scenes/mainMenu';
import {PieceSide} from './helper/piece';

export class Game extends Engine {
  static _game: Game | undefined = undefined;

  constructor() {
    super({
      canvasElementId: 'game',
      pointerScope: Input.PointerScope.Document,
      suppressPlayButton: true,
      suppressConsoleBootMessage: true,
      displayMode: DisplayMode.Fixed,
      width: 900,
      height: 600,
    });
  }

  public override start() {
    // Automatically load all default resources
    const loader = new Loader(Object.values(Resources));

    game.add('mainMenu', new MainMenu());

    return super.start(loader);
  }

  public startGame(ourPlayer: PieceSide) {
    game.removeScene('mainMenu');
    game.add('board', Board.get());
    State.init(ourPlayer);

    game.goToScene('board');
    Board.get().updateInfo([StateInfoOptions.whiteMove]);
  }

  returnToMenu() {
    Board.destroy();
    if (game.scenes['mainMenu'] != undefined) {
      game.removeScene('mainMenu');
    }

    game.add('mainMenu', new MainMenu());
    game.goToScene('mainMenu');
  }

  static get(): Game {
    if (this._game == undefined) {
      this._game = new Game();
    }

    return this._game;
  }
}

const game = Game.get();

game.start().then(() => {
  game.goToScene('mainMenu');
});

game.input.pointers.primary.on('up', function (event) {
  // We should stop the input from proceeding if we are over a child of the ui
  const elementsOver = document.elementsFromPoint(
    event.coordinates.pagePos.x,
    event.coordinates.pagePos.y,
  );

  // Look through the list of elements, if the UI is second, allow the input to continue
  if (elementsOver[0]?.id != 'ui') {
    return;
  }

  if (game.currentScene == Board.get()) {
    ChessInput.get().onChessAction(event);
  }
});
