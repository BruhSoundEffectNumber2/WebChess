import { Actor, ImageSource, vec, Vector } from "excalibur";
import { BoardState } from "../boardState";
import { Move } from "../move";
import { BishopRules } from "../pieceRules/bishopRules";
import { KingRules } from "../pieceRules/kingRules";
import { KnightRules } from "../pieceRules/knightRules";
import { PawnRules } from "../pieceRules/pawnRules";
import { QueenRules } from "../pieceRules/queenRules";
import { RookRules } from "../pieceRules/rookRules";
import { Resources } from "../resources";

export class Piece extends Actor {
    private type: string;

    constructor(type: string, boardPos: Vector) {
        super({
            width: 45,
            height: 45,
            anchor: Vector.Zero,
            pos: vec(boardPos.x * 75 + 15, boardPos.y * 75 + 15)
        });

        this.type = type;
    }

    onInitialize(): void {
        this.graphics.use(this.getImage(this.type).toSprite());
    }

    // Gets image source from type
    private getImage(type: string): ImageSource {
        // TODO: Maybe have a more elegant solution?
        switch (type) {
            case "kw": {
                return Resources.KW;
            }
            case "kb": {
                return Resources.KB;
            }
            case "qw": {
                return Resources.QW;
            }
            case "qb": {
                return Resources.QB;
            }
            case "bw": {
                return Resources.BW;
            }
            case "bb": {
                return Resources.BB;
            }
            case "nw": {
                return Resources.NW;
            }
            case "nb": {
                return Resources.NB;
            }
            case "pw": {
                return Resources.PW;
            }
            case "pb": {
                return Resources.PB;
            }
            case "rw": {
                return Resources.RW;
            }
            case "rb": {
                return Resources.RB;
            }
        }

        // TODO: better error handling for this function
        return new ImageSource("");
    }

    // Gets the possible legal moves a piece can make
    static getLegalMoves(board: BoardState, pos: Vector): Move[] {
        const type = board.getPieceType(pos);        

        if (type == "") {
            return [];
        }

        let ruleObject;

        switch (type.charAt(0)) {
            case "p": ruleObject = new PawnRules(); break;
            case "b": ruleObject = new BishopRules(); break;
            case "r": ruleObject = new RookRules(); break;
            case "q": ruleObject = new QueenRules(); break;
            case "k": ruleObject = new KingRules(); break;
            case "n": ruleObject = new KnightRules(); break;
        }

        return ruleObject.getLegalMoves(board, pos);
    }
}