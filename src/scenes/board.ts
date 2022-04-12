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

        this.pieces = [];

        this.setupBoard();

        // Add pieces to the scene
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

        // White Pieces
        this.pieces.push(new Piece("rw", vec(0, 7)));
        this.pieces.push(new Piece("nw", vec(1, 7)));
        this.pieces.push(new Piece("bw", vec(2, 7)));
        this.pieces.push(new Piece("qw", vec(3, 7)));
        this.pieces.push(new Piece("kw", vec(4, 7)));
        this.pieces.push(new Piece("bw", vec(5, 7)));
        this.pieces.push(new Piece("nw", vec(6, 7)));
        this.pieces.push(new Piece("rw", vec(7, 7)));

        // Pawns
        this.pieces.push(new Piece("pw", vec(0, 6)));
        this.pieces.push(new Piece("pw", vec(1, 6)));
        this.pieces.push(new Piece("pw", vec(2, 6)));
        this.pieces.push(new Piece("pw", vec(3, 6)));
        this.pieces.push(new Piece("pw", vec(4, 6)));
        this.pieces.push(new Piece("pw", vec(5, 6)));
        this.pieces.push(new Piece("pw", vec(6, 6)));
        this.pieces.push(new Piece("pw", vec(7, 6)));
    }

    getPieceAtPos(pos: Vector): Piece {
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            
            if (piece.boardPos.equals(pos)) {
                return this.pieces[i];
            }
        }

        return undefined;
    }
}