import {ImageSource, Random, Sound} from 'excalibur';

// Chess Pieces
import kw from './resources/images/pieces/KW.png';
import kb from './resources/images/pieces/KB.png';
import qw from './resources/images/pieces/QW.png';
import qb from './resources/images/pieces/QB.png';
import bw from './resources/images/pieces/BW.png';
import bb from './resources/images/pieces/BB.png';
import nw from './resources/images/pieces/NW.png';
import nb from './resources/images/pieces/NB.png';
import pw from './resources/images/pieces/PW.png';
import pb from './resources/images/pieces/PB.png';
import rw from './resources/images/pieces/RW.png';
import rb from './resources/images/pieces/RB.png';

// Audio
import buttonPress from './resources/audio/ui/buttonPress.ogg';

import pieceMoved1 from './resources/audio/chess/pieceMoved1.ogg';
import pieceMoved2 from './resources/audio/chess/pieceMoved2.ogg';
import pieceMoved3 from './resources/audio/chess/pieceMoved3.ogg';

/**
 * Default global resource dictionary. This gets loaded immediately
 * and holds available assets for the game.
 */
const Resources = {
  // Chess Pieces
  KW: new ImageSource(kw),
  KB: new ImageSource(kb),
  QW: new ImageSource(qw),
  QB: new ImageSource(qb),
  BW: new ImageSource(bw),
  BB: new ImageSource(bb),
  NW: new ImageSource(nw),
  NB: new ImageSource(nb),
  PW: new ImageSource(pw),
  PB: new ImageSource(pb),
  RW: new ImageSource(rw),
  RB: new ImageSource(rb),
  // Audio
  buttonPress: new Sound(buttonPress),
  pieceMoved1: new Sound(pieceMoved1),
  pieceMoved2: new Sound(pieceMoved2),
  pieceMoved3: new Sound(pieceMoved3),
};

export {Resources};

export function playChessMovedSound(): void {
  const i = new Random().integer(1, 3);

  switch (i) {
    case 1:
      Resources.pieceMoved1.play(0.4);
      break;
    case 2:
      Resources.pieceMoved2.play(0.4);
      break;
    case 3:
      Resources.pieceMoved3.play(0.4);
      break;
  }
}
