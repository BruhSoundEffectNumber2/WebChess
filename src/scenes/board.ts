import { Actor, Color, Engine, Rectangle, Scene, vec, Vector } from "excalibur";
import { Piece } from "../actors/piece";

export class Board extends Scene {
    public pieces: Piece[];

    onInitialize(_engine: Engine): void {
        // Rectangles for the board squares
        const lightSquare = new Rectangle({
            width: 75,
            height: 75,
            color: Color.fromHex("f3dab2")
        });

        const darkSquare = new Rectangle({
            width: 75,
            height: 75,
            color: Color.fromHex("bd875e")
        });

        // Create a checkerboard pattern of dark and light squares
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const light = (x + y) % 2 == 0;

                const actor = new Actor({
                    width: 75,
                    height: 75,
                    pos: vec(x * 75, y * 75),
                    anchor: Vector.Zero
                });

                actor.graphics.use(light ? lightSquare : darkSquare);
                this.add(actor);
            }
        }

        this.pieces = new Array();

        this.setupBoard();

        this.pieces.forEach(piece => {
            this.add(piece);
        });
    }

    setupBoard(): void {
        // Black Pieces
        this.pieces.push(new Piece("rb", vec(0, 0)));
        this.pieces.push(new Piece("nb", vec(1, 0)));
        this.pieces.push(new Piece("bb", vec(2, 0)));
        this.pieces.push(new Piece("qb", vec(3, 0)));
        this.pieces.push(new Piece("kb", vec(4, 0)));
        this.pieces.push(new Piece("bb", vec(5, 0)));
        this.pieces.push(new Piece("nb", vec(6, 0)));
        this.pieces.push(new Piece("rb", vec(7, 0)));

        // Pawns
        this.pieces.push(new Piece("pb", vec(0, 1)));
        this.pieces.push(new Piece("pb", vec(1, 1)));
        this.pieces.push(new Piece("pb", vec(2, 1)));
        this.pieces.push(new Piece("pb", vec(3, 1)));
        this.pieces.push(new Piece("pb", vec(4, 1)));
        this.pieces.push(new Piece("pb", vec(5, 1)));
        this.pieces.push(new Piece("pb", vec(6, 1)));
        this.pieces.push(new Piece("pb", vec(7, 1)));
    }
}