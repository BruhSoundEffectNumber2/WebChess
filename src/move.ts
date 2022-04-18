import { Vector } from "excalibur";

export class Move {
    public piece: string;
    public start: Vector;
    public end: Vector;

    constructor(piece: string, start: Vector, end: Vector) {
        this.piece = piece;
        this.start = start;
        this.end = end;
    }
}