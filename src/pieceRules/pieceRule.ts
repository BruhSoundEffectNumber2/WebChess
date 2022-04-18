import { Vector } from "excalibur";
import { Move } from "../move";
import { Board } from "../scenes/board";

export interface PieceRule {
    getLegalMoves(board: Board, pos: Vector): Move[];
}