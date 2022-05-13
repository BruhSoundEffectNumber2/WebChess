import {Actor, Color, Rectangle, vec, Vector} from 'excalibur';

export class MoveLocationActor extends Actor {
  constructor(pos: Vector) {
    super({
      pos: vec(pos.x * 75, pos.y * 75),
      anchor: Vector.Zero,
    });
  }

  override onInitialize(): void {
    const rectangle = new Rectangle({
      width: 75,
      height: 75,
      color: Color.fromRGB(0, 255, 0),
    });

    rectangle.opacity = 0.3;

    this.graphics.use(rectangle);
  }
}
