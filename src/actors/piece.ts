import { Actor, ImageSource, vec, Vector } from "excalibur";
import { Move } from "../move";
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

        switch (type.charAt(0)) {
            case "p": return this.getPawnLegalMoves(board, pos);
        }
    }

    private static getPawnLegalMoves(board: Board, pos: Vector): Move[] {
        // TODO: moving 2 spaces in first move/en passent
        
        /*
        * The pawn can move 1 space towards the other color,
        * or one space diagonally towards the other color if an enemy
        * piece is occupying it.
        */

        const moves: Move[] = [];

        const ourType = board.getPieceType(pos);
        const ourColor = board.getPieceColor(pos);
        
        // Temp variables for possible moves
        let optionColor;
        let optionType;
        let optionPos;

        // Moving one up
        if (pos.y != 0) {
            optionPos = pos.add(vec(0, -1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 0 && ourColor == 1) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        // Moving one up/left
        if (pos.y != 0 && pos.x != 0) {
            optionPos = pos.add(vec(-1, -1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 2 && ourColor == 1) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        // Moving one up/right
        if (pos.y != 0 && pos.x != 7) {
            optionPos = pos.add(vec(1, -1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 2 && ourColor == 1) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        // Moving down
        if (pos.y != 7) {
            optionPos = pos.add(vec(0, 1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 0 && ourColor == 2) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        // Moving down up/left
        if (pos.y != 7 && pos.x != 0) {
            optionPos = pos.add(vec(-1, 1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 1 && ourColor == 2) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        // Moving down up/right
        if (pos.y != 7 && pos.x != 7) {
            optionPos = pos.add(vec(1, 1));
            optionColor = board.getPieceColor(optionPos);

            if (optionColor == 1 && ourColor == 2) {
                moves.push(new Move(ourType, pos, optionPos));
            }
        }

        return moves;
    }
}