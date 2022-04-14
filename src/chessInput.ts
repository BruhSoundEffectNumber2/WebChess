import { vec } from "excalibur";
import { PointerEvent } from "excalibur/build/dist/Input";
import { Game } from ".";

export class ChessInput {
    private game: Game;

    onChessAction(event: PointerEvent): void {
        const eventPos = vec(Math.floor(event.worldPos.x / 75), Math.floor(event.worldPos.y / 75));
        
    }
}