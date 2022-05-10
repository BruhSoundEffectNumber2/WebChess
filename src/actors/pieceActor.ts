import {Actor, ImageSource, vec, Vector} from 'excalibur';
import {Resources} from '../resources';

export class PieceActor extends Actor {
  private type: string;

  constructor(type: string, boardPos: Vector) {
    super({
      width: 45,
      height: 45,
      anchor: Vector.Zero,
      pos: vec(boardPos.x * 75 + 15, boardPos.y * 75 + 15),
    });

    this.type = type;
  }

  override onInitialize(): void {
    this.graphics.use(this.getImage(this.type).toSprite());
  }

  private getImage(type: string): ImageSource {
    switch (type) {
      case 'kw': {
        return Resources.KW;
      }
      case 'kb': {
        return Resources.KB;
      }
      case 'qw': {
        return Resources.QW;
      }
      case 'qb': {
        return Resources.QB;
      }
      case 'bw': {
        return Resources.BW;
      }
      case 'bb': {
        return Resources.BB;
      }
      case 'nw': {
        return Resources.NW;
      }
      case 'nb': {
        return Resources.NB;
      }
      case 'pw': {
        return Resources.PW;
      }
      case 'pb': {
        return Resources.PB;
      }
      case 'rw': {
        return Resources.RW;
      }
      case 'rb': {
        return Resources.RB;
      }
    }

    throw new Error('Could not find a resource for a piece of type: ' + type);
  }
}
