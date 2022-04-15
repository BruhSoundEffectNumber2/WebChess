import { Actor, ImageSource, vec, Vector } from "excalibur";
import { Resources } from "../resources";

export class Piece extends Actor {
    public type: string;

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
        const sprite = Piece.getImage(this.type).toSprite();
        this.graphics.use(sprite);
    }

    /**
     * Gets the image for a chess piece.
     * @param type The type of piece.
     */
    static getImage(type: string): ImageSource {
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
}