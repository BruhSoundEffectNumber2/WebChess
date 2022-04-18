import { Actor, ImageSource, vec, Vector } from "excalibur";
import { Move } from "../move";
import { BishopRules } from "../pieceRules/bishopRules";
import { PawnRules } from "../pieceRules/pawnRules";
import { Resources } from "../resources";
import { Board } from "../scenes/board";

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
    }

    // Gets the possible legal moves a piece can make
    static getLegalMoves(board: Board, pos: Vector): Move[] {
        const type = board.getPieceType(pos);        

        if (type == "") {
            return;
        }

        let ruleObject;

        switch (type.charAt(0)) {
            case "p": ruleObject = new PawnRules(); break;
            case "b": ruleObject = new BishopRules(); break;
        }

        return ruleObject.getLegalMoves(board, pos);
    }
}