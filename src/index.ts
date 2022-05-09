// The stylesheet has to be imported into index so it can be found by Webpack
import "./styles/main.scss";

import { Engine, Loader, Input } from "excalibur";
import { InfoPanel } from "./actors/infoPanel";
import { ChessInput } from "./chessInput";
import { Resources } from "./resources";
import { Board } from "./scenes/board";
import { State } from "./state";
import { Network } from "./network";
import { MainMenu } from "./scenes/mainMenu";

export class Game extends Engine {
    public board: Board;
    public chessInput: ChessInput;
    public infoPanel: InfoPanel;
    public network: Network;

    constructor() {
        super({ 
            width: 900,
            height: 600,
            canvasElementId: "game",
            pointerScope: Input.PointerScope.Canvas,
        });
    }

    public start() {
        // Automatically load all default resources
        const loader = new Loader(Object.values(Resources));
        loader.suppressPlayButton = true;

        //game.add(new Button(vec(450, 300), vec(100, 30)));
        this.network = new Network(this);

        game.add("mainMenu", new MainMenu());

        return super.start(loader);
    }

    public startGame(ourPlayer: number) {
        this.board = new Board(this);
        this.chessInput = new ChessInput(this);
        
        game.add("board", this.board);
        State.initState(this.board, ourPlayer);

        this.infoPanel = new InfoPanel(this.board);

        game.goToScene("board");
    }
}

const game = new Game();

game.start().then(() => {
    game.goToScene("mainMenu");
});

game.input.pointers.primary.on("up", function(event) {
    if (game.chessInput) {
        game.chessInput.onChessAction(event);
    }
});
