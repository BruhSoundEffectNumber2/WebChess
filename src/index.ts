import { Engine, Loader, vec, Vector } from "excalibur";
import { Piece } from "./actors/piece";
import { Resources } from "./resources";
import { Board } from "./scenes/board";

class Game extends Engine {
    public board: Board;
    public activePiece: Piece;

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

game.input.pointers.primary.on("up", function(event) {
    const boardPos = vec(Math.floor(event.worldPos.x / 75), Math.floor(event.worldPos.y / 75));
    const piece = game.board.getPieceAtPos(boardPos);

    if (game.activePiece) {
        if (piece == undefined || piece.light != game.activePiece.light) {
            game.activePiece.setBoardPos(boardPos);
        } else {
            game.activePiece = piece;
        }
    } else {
        game.activePiece = piece;
    }
});