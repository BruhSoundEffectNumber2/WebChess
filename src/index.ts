// The stylesheet has to be imported into index so it can be found by Webpack
import './styles/main.scss';

import {Engine, Loader, Input} from 'excalibur';
import {ChessInput} from './input/chessInput';
import {Resources} from './resources';
import {Board} from './scenes/board';
import {State} from './state/state';
import {MainMenu} from './scenes/mainMenu';
import {PieceSide} from './helper/piece';

export class Game extends Engine {
  constructor() {
    super({
      width: 900,
      height: 600,
      canvasElementId: 'game',
      pointerScope: Input.PointerScope.Canvas,
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
    game.add('board', Board.get());
    State.init(ourPlayer);

    game.goToScene('board');
  }
}

const game = new Game();

game.start().then(() => {
  game.goToScene('mainMenu');
});

game.input.pointers.primary.on('up', function (event) {
  if (game.currentScene == Board.get()) {
    ChessInput.get().onChessAction(event);
  }
});
