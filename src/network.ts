import {vec} from 'excalibur';
import {io, Socket} from 'socket.io-client';
import {Game} from '.';
import {Move} from './move';
import {State} from './state';

export class Network {
  private game: Game;
  private socket: Socket;
  private match: string;

  constructor(game: Game) {
    this.game = game;
  }

  connect() {
    this.socket = io(__ServerAddress__);

    this.socket.on('connect', () => {
      console.log('Connected to server.');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server.');
    });

    this.socket.on('matched', (match: string, ourPlayer: number) => {
      this.matched(match, ourPlayer);
    });

    this.socket.on('move', (move) => {
      /**
       * The JSON process incorrectly converts property names
       * between sending and receiving,
       * so we need to create a new Move from the parsed JSON data.
       */
      const convertedMove = new Move(
        move.piece,
        vec(move.start._x, move.start._y),
        vec(move.end._x, move.end._y),
      );

      this.receiveMove(convertedMove);
    });
  }

  sendMove(move: Move) {
    if (!this.socket.connected) {
      console.warn('Trying to move when not connected.');
    }

    console.log('Sending move' + move);

    this.socket.emit('move', this.match, move);
  }

  private receiveMove(move: Move) {
    console.log('Received move');

    State.getState().boardState.movePiece(move.start, move.end, false, false);
  }

  startMatchmaking() {
    if (!this.socket.connected) {
      console.warn('Trying to match when not connected.');
    }

    console.log('Starting matchmaking');

    this.socket.emit('match');
  }

  private matched(match: string, ourPlayer: number) {
    console.log('Matched');

    this.match = match;
    this.game.startGame(ourPlayer);
  }
}
