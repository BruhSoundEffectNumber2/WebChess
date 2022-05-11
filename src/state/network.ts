import {vec} from 'excalibur';
import {io, Socket} from 'socket.io-client';
import {Game} from '..';
import {Move} from '../helper/move';
import {State} from './state';

export class Network {
  static _network: Network | undefined = undefined;

  private _socket!: Socket;
  private _match!: string;

  connect() {
    this._socket = io(__ServerAddress__);

    this._socket.on('connect', () => {
      console.log('Connected to server.');
    });

    this._socket.on('disconnect', () => {
      console.log('Disconnected from server.');
    });

    this._socket.on('matched', (match: string, ourPlayer: number) => {
      this.matched(match, ourPlayer);
    });

    this._socket.on('move', (move) => {
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
    if (!this._socket.connected) {
      console.warn('Trying to move when not connected.');
    }

    console.log('Sending move' + move);

    this._socket.emit('move', this._match, move);
  }

  private receiveMove(move: Move) {
    console.log('Received move');

    State.get().boardState.movePiece(move);
  }

  startMatchmaking() {
    if (!this._socket.connected) {
      console.warn('Trying to match when not connected.');
    }

    console.log('Starting matchmaking');

    this._socket.emit('match');
  }

  private matched(match: string, ourPlayer: number) {
    console.log('Matched');

    this._match = match;
    Game.get().startGame(ourPlayer);
  }

  static get(): Network {
    if (this._network == undefined) {
      this._network = new Network();
    }

    return this._network;
  }
}
