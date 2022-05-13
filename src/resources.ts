import {ImageSource} from 'excalibur';

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
};

export {Resources};
