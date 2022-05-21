// The stylesheet has to be imported into index so it can be found by Webpack
import './styles/main.scss';
import './styles/mainMenu.scss';
import './styles/board.scss';

import {Engine, Input, Loader} from 'excalibur';
import {ChessInput} from './input/chessInput';
import {Resources} from './resources';
import {Board} from './scenes/board';
import {State} from './state/state';
import {MainMenu} from './scenes/mainMenu';
import {PieceSide} from './helper/piece';
import {UIManager} from './ui/uiManager';

export class Game extends Engine {
  static _game: Game | undefined = undefined;

  constructor() {
    super({
      width: 900,
      height: 600,
      canvasElementId: 'game',
      pointerScope: Input.PointerScope.Document,
    });
  }

  public override start() {
    // Automatically load all default resources
    const loader = new Loader(Object.values(Resources));
    loader.suppressPlayButton = true;

    game.add('mainMenu', new MainMenu());

    return super.start(loader);
  }

  public startGame(ourPlayer: PieceSide) {
    game.removeScene('mainMenu');
    game.add('board', Board.get());
    State.init(ourPlayer);

    game.goToScene('board');
  }

  returnToMenu() {
    Board.destroy();
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
  UIManager.get().errorPopup(
    'Header',
    'This is some text that we might see in a popup of this kind. It will probably be long enough to wrap.',
  );
});

game.input.pointers.primary.on('up', function (event) {
  // We should stop the input from proceeding if we are over a child of the ui
  const elementsOver = document.elementsFromPoint(
    event.coordinates.pagePos.x,
    event.coordinates.pagePos.y,
  );

  // Look through the list of elements, if the UI is second, allow the input to continue
  if (elementsOver[1]?.id != 'ui') {
    return;
  }

  if (game.currentScene == Board.get()) {
    ChessInput.get().onChessAction(event);
  }
});
