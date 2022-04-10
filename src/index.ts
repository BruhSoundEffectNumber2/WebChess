import { Engine, Loader } from "excalibur";
import { Resources } from "./resources";
import { Board } from "./scenes/board";

class Game extends Engine {
    public board: Board;

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
        
        game.add("board", this.board);

        return super.start(loader);
    }
}

const game = new Game();

game.start().then(() => {
    game.goToScene("board");
});
