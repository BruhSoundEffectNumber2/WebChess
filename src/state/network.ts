import {vec} from 'excalibur';
import {io, Socket} from 'socket.io-client';
import {Game} from '..';
import {Move} from '../helper/move';
import {Piece} from '../helper/piece';
import {MainMenu} from '../scenes/mainMenu';
import {UIManager} from '../ui/uiManager';
import {State} from './state';

export class Network {
  static _network: Network | undefined = undefined;

  private _socket!: Socket;
  private _match!: string;
  private _connectionAttempts = 0;
  // How many times will the socket try to connect before giving up
  private readonly maxConnectionAttempts = 3;

  disconnect() {
    this._socket.disconnect();
  }

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

        UIManager.get().errorPopup(
          'Connection Error',
          'There was an error when connecting to the server, and all retry attempts failed.',
        );
        this._socket.disconnect();
        if (Game.get().scenes['mainMenu']?.isCurrentScene) {
          (Game.get().currentScene as MainMenu).reset();
        }
        this._connectionAttempts = 0;
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

    this._socket.on('surrender', () => {
      UIManager.get().alertPopup(
        'Surrender',
        'Your opponent has decided to surrender. The match will now end.',
        () => {
          this.endMatch();
        },
      );
    });

    this._socket.on('offerDraw', () => {
      UIManager.get().decisionPopup(
        'Draw Offered',
        'Your opponent has offered a draw. You can choose to accept or reject it.',
        'Accept',
        () => {
          this._socket.emit('drawAccepted', this._match);
          this.endMatch();
        },
        'Reject',
        () => {
          this._socket.emit('drawRejected', this._match);
        },
      );
    });

    this._socket.on('drawAccepted', () => {
      UIManager.get().alertPopup(
        'Draw Accepted',
        'Your opponent has agreed to draw. The match will now end.',
        () => {
          this.endMatch();
        },
      );
    });

    this._socket.on('drawRejected', () => {
      UIManager.get().alertPopup(
        'Draw Rejected',
        'Your opponent has not agreed to draw. The match will continue.',
      );
    });
  }

  sendMove(move: Move) {
    this._socket.emit('move', this._match, move);
  }

  offerDraw(): void {
    this._socket.emit('offerDraw', this._match);
  }

  surrender(): void {
    this._socket.emit('surrender', this._match);
  }

  private receiveMove(move: Move) {
    State.get().boardState.movePiece(move);
    State.get().pieceMoved();
  }

  startMatchmaking() {
    console.log('Starting matchmaking');

    this._socket.emit('match');
  }

  public sendMatchEnd(victor: number) {
    this._socket.emit('matchEnd', victor);
  }

  private matched(match: string, ourPlayer: number) {
    console.log('Matched');

    this._match = match;
    Game.get().startGame(ourPlayer);
  }

  private endMatch() {
    Game.get().returnToMenu();
    this.disconnect();
  }

  static get(): Network {
    if (this._network == undefined) {
      this._network = new Network();
    }

    return this._network;
  }
}
