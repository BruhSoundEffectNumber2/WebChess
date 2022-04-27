import { Vector } from "excalibur";
import { BoardState } from "../boardState";
import { Move } from "../move";

export interface PieceRule {
    getLegalMoves(board: BoardState, pos: Vector): Move[];
}