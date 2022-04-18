import { Actor, Color, Engine, Rectangle, vec, Vector } from "excalibur";

export class MoveLocation extends Actor {
    constructor(pos: Vector) {
        super({
            pos: vec(pos.x * 75, pos.y * 75),
            anchor: Vector.Zero
        });
    }

    onInitialize(_engine: Engine): void {
        const rectangle = new Rectangle({
            width: 75,
            height: 75,
            color: Color.fromRGB(0, 255, 0)
        });

        rectangle.opacity = 0.3;

        this.graphics.use(rectangle);
    }
}