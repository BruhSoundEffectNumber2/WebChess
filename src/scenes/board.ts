import { Actor, Color, Engine, Rectangle, Scene, vec, Vector } from "excalibur";
import { Piece } from "../actors/piece";

export class Board extends Scene {
    private pieceActors: Piece[];
    private pieces: string[][];

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

        this.setupBoard();
        this.pieceActors = [];

        this.resetActors();
    }

    setupBoard(): void {
        this.pieces = [
            ["rb", "nb", "bb", "qb", "kb", "bb", "nb", "rb"],
            ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb"],
            [  "",   "",   "",   "",   "",   "",   "",   ""],
            [  "",   "",   "",   "",   "",   "",   "",   ""],
            [  "",   "",   "",   "",   "",   "",   "",   ""],
            [  "",   "",   "",   "",   "",   "",   "",   ""],
            ["pw", "pw", "pw", "pw", "pw", "pw", "pw", "pw"],
            ["rw", "nw", "bw", "qw", "kw", "bw", "nw", "rw"]
        ];
    }

    resetActors(): void {
        // TODO: Object pooling, more efficient way of moving pieces
        this.pieceActors.forEach(piece => {
            this.remove(piece);
        });

        this.pieceActors = [];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let type = this.pieces[y][x];

                // For when a space is not occupied by a piece
                if (type == "") {
                    continue;
                }

                let actor = new Piece(type, vec(x, y));
                this.add(actor);
                this.pieceActors.push(actor);
            }
        }
    }

    getPieceType(pos: Vector): string {
        return this.pieces[pos.y][pos.x];
    }

    movePiece(start: Vector, end: Vector): void {
        // Make sure a piece is there to be moved
        if (this.pieces[start.y][start.x] == "") {
            return;
        }

        // TODO: Have logic for piece capturing
        let pieceType = this.pieces[start.y][start.x];
        
        this.pieces[start.y][start.x] = "";
        this.pieces[end.y][end.x] = pieceType;

        this.resetActors();
    }
}