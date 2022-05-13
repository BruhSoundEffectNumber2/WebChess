import {vec} from 'excalibur';
import {io, Socket} from 'socket.io-client';
import {Game} from '..';
import {Move} from '../helper/move';
import {Piece} from '../helper/piece';
import {State} from './state';

export class Network {
  static _network: Network | undefined = undefined;

  private _socket!: Socket;
  private _match!: string;
  private _connectionAttempts = 0;
  // How many times will the socket try to connect before giving up
  private readonly maxConnectionAttempts = 3;

  connect() {
    this._socket = io(__ServerAddress__);

    this._socket.on('connect', () => {
      console.log('Connected to server.');
    });

    this._socket.on('connect_error', (err) => {
      this._connectionAttempts++;
      console.log('Could not connect due to %s', err.message);

      if (this._connectionAttempts >= this.maxConnectionAttempts) {
        console.log(
          'We have been unable to connect to the server, disconnecting socket...',
        );

        this._socket.disconnect();
      }
    });

    this._socket.on('disconnect', () => {
      console.log('Disconnected from server.');
    });

    this._socket.on('matched', (match: string, ourPlayer: number) => {
      this.matched(match, ourPlayer);
    });

    this._socket.on('move', (move) => {
      // Convert from object literal to class instance
      this.receiveMove(
        new Move(
          new Piece(
            vec(move._piece._x, move._piece._y),
            move._piece._type,
            move._piece._side,
          ),
          vec(move._start._x, move._start._y),
          vec(move._end._x, move._end._y),
        ),
      );
    });
  }

  sendMove(move: Move) {
    if (!this._socket.connected) {
      console.warn('Trying to move when not connected.');
    }

    this._socket.emit('move', this._match, move);
  }

  private receiveMove(move: Move) {
    console.log('Received move');

    State.get().boardState.movePiece(move);
    State.get().pieceMoved();
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
