import { Engine, Loader } from "excalibur";
import { InfoPanel } from "./actors/infoPanel";
import { ChessInput } from "./chessInput";
import { Resources } from "./resources";
import { Board } from "./scenes/board";
import { State } from "./state";
import { Network } from "./network";

export class Game extends Engine {
    public board: Board;
    public chessInput: ChessInput;
    public infoPanel: InfoPanel;
    public network: Network;

    constructor() {
        super({ 
            width: 900,
            height: 600
        });
    }

    public start() {
        // Automatically load all default resources
        const loader = new Loader(Object.values(Resources));
        loader.suppressPlayButton = true;

        this.board = new Board(this);
        this.chessInput = new ChessInput(this);
        
        game.add("board", this.board);
        State.initState(this.board);

        this.infoPanel = new InfoPanel(this.board);

        //game.add(new Button(vec(450, 300), vec(100, 30)));
        this.network = new Network();
        this.network.connect();

        return super.start(loader);
    }
}

const game = new Game();

game.start().then(() => {
    game.goToScene("board");
});

game.input.pointers.primary.on("up", function(event) {
    game.chessInput.onChessAction(event);
});
