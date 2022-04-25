import { Actor, Color, Engine, Rectangle, Scene, vec, Vector } from "excalibur";
import { Game } from "..";
import { MoveLocation } from "../actors/moveLocation";
import { Piece } from "../actors/piece";
import { Move } from "../move";
import { State } from "../state";

export class Board extends Scene {
    private pieceActors: Piece[];
    private moveLocationActors: MoveLocation[];
    private pieces: string[][];
    private game: Game;

    constructor(game: Game) {
        super();
        this.game = game;
    }

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
        this.moveLocationActors = [];

        this.resetPieceActors();
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

    resetPieceActors(): void {
        // TODO: Object pooling, more efficient way of moving pieces
        this.pieceActors.forEach(piece => {
            this.remove(piece);
        });

        this.pieceActors = [];

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const type = this.pieces[y][x];

                // For when a space is not occupied by a piece
                if (type == "") {
                    continue;
                }

                const actor = new Piece(type, vec(x, y));
                this.add(actor);
                this.pieceActors.push(actor);
            }
        }
    }

    resetMoveLocationActors(moves: Move[]): void {
        this.moveLocationActors.forEach(actor => {
            this.remove(actor);
        });

        this.moveLocationActors = [];

        if (moves == undefined) {
            return;
        }

        moves.forEach(move => {
            const actor = new MoveLocation(move.end);
            this.add(actor);
            this.moveLocationActors.push(actor);
        });
    }

    getPieceType(pos: Vector): string {
        return this.pieces[pos.y][pos.x];
    }

    // Gets color of piece at pos. 0: empty, 1: white, 2: black
    getPieceColor(pos: Vector): number {
        const type = this.getPieceType(pos);
        
        if (type == "") {
            return 0;
        } else if (type.charAt(1) == "w") {
            return 1;
        } else {
            return 2;
        }
    }

    movePiece(start: Vector, end: Vector): void {
        // Make sure a piece is there to be moved
        if (this.pieces[start.y][start.x] == "") {
            return;
        }

        // TODO: Have logic for piece capturing
        const pieceType = this.pieces[start.y][start.x];
        
        this.pieces[start.y][start.x] = "";
        this.pieces[end.y][end.x] = pieceType;
        
        this.resetPieceActors();
        State.getState().turnMade();
        this.game.infoPanel.update();
    }

    getKingPos(color: number): Vector | undefined {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const type = this.getPieceType(vec(x, y));

                if (type.charAt(0) == "k") {
                    if (this.getPieceColor(vec(x, y)) == color) {
                        return vec(x, y);
                    }
                }
            }
        }
    }

    kingInCheck(): number {
        const allLegalMoves: Move[] = [];
        const whiteKingPos = this.getKingPos(1);
        const blackKingPos = this.getKingPos(2);

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const legalMoves = Piece.getLegalMoves(this, vec(x, y));

                if (legalMoves.length > 0) {
                    allLegalMoves.push(...legalMoves);
                }
            }
        }

        for (const move of allLegalMoves) {
            if (whiteKingPos != undefined) {
                if (move.end.equals(whiteKingPos)) {
                    // Make sure the other king isn't the one checking this king
                    if (move.piece != "kb") {
                        return 1;
                    }
                }
            }

            if (blackKingPos != undefined) {
                if (move.end.equals(blackKingPos)) {
                    // Make sure the other king isn't the one checking this king
                    if (move.piece != "kw") {
                        return 2;
                    }
                }
            }
        }

        return 0;
    }
}