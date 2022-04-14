import { Engine, Loader, vec, Vector } from "excalibur";
import { Piece } from "./actors/piece";
import { ChessInput } from "./chessInput";
import { Resources } from "./resources";
import { Board } from "./scenes/board";
export class Game extends Engine {
    public board: Board;
    public chessInput: ChessInput;

    constructor() {
        super({ 
            width: 600,
            height: 600
        });
    }

    public start() {
        // Automatically load all default resources
        const loader = new Loader(Object.values(Resources));
        loader.suppressPlayButton = true;

        this.board = new Board();
        this.chessInput = new ChessInput();
        
        game.add("board", this.board);

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