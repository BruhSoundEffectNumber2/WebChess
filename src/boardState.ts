import { Vector, vec } from "excalibur";
import { State } from "./state";

export class BoardState {
    private pieces: string[][];

    constructor() {
        this.setupBoard();
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

    copyStateFrom(state: BoardState) {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                this.pieces[y][x] = state.pieces[y][x];
            }
        }
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

    movePiece(start: Vector, end: Vector, virtual = false): void {
        // Make sure a piece is there to be moved
        if (this.pieces[start.y][start.x] == "") {
            return;
        }

        // TODO: Have more logic for piece capturing
        const pieceType = this.pieces[start.y][start.x];
        
        this.pieces[start.y][start.x] = "";
        this.pieces[end.y][end.x] = pieceType;
        
        if (!virtual) {
            State.getState().board.resetPieceActors();
            State.getState().turnMade();
            State.getState().board.game.infoPanel.update();
        }
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
}