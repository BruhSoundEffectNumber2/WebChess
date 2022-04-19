import { Vector } from "excalibur";
import { Move } from "../move";
import { Board } from "../scenes/board";
import { PieceRule } from "./pieceRule";

export class KnightRules implements PieceRule {
    getLegalMoves(board: Board, pos: Vector): Move[] {
        throw new Error("Method not implemented.");
    }
}