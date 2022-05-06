import { Engine, Loader } from "excalibur";
import { InfoPanel } from "./actors/infoPanel";
import { ChessInput } from "./chessInput";
import { Resources } from "./resources";
import { Board } from "./scenes/board";
import { State } from "./state";
import { io } from "socket.io-client";

export class Game extends Engine {
    public board: Board;
    public chessInput: ChessInput;
    public infoPanel: InfoPanel;

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

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected: " + socket.id);
});

socket.emit("hello");