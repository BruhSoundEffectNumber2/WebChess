import {createServer} from 'http';
import {Server, Socket} from 'socket.io';
import {v4 as uuidv4} from 'uuid';

/* The server and app versions must match exactly, else a wrongVersion error will occur. */
const serverVersion = '0.1.2';

class Player {
  public matched = false;
  public wantsMatch = false;

  constructor(public readonly id: string) {}
}

class Match {
  constructor(
    // Also servers as the room the match is in
    public readonly id: string,
    public readonly player1: Player,
    public readonly player2: Player,
  ) {}
}

class ChessServer {
  private _players: Player[];
  private _matches: Match[];

  private _httpServer;
  private _io: Server;

  constructor() {
    this._players = [];
    this._matches = [];

    // Create a WebServer that will accept data from our DevServer or our Netlify apps
    this._httpServer = createServer();
    this._io = new Server(this._httpServer, {
      cors: {
        origin: ['http://localhost:8080', /(?:chess-on-web\.netlify\.app)/],
      },
    });

    this._io.on('connection', (socket) => {
      // Check for version compatibility (major and minor must match)
      if (socket.handshake.query['version']) {
        const appVer = (socket.handshake.query['version'] as string).split('.');
        const serVer = serverVersion.split('.');

        if (!(serVer[0] == appVer[0] && serVer[1] == appVer[1])) {
          socket.emit('wrongVersion');
          socket.disconnect(true);
          return;
        }
      } else {
        console.error('Client did not send its version to server.');
        return;
      }

      this.setupSocketEvents(socket);
      this.playerEnters(socket.id);
    });
  }

  startListening() {
    this._io.listen(3000);
    console.log('Server Version: %s', serverVersion);
    console.log('Listening on port 3000');
  }

  private getMatchPlayerIsIn(player: Player): Match | undefined {
    return this._matches.find(
      (match) => match.player1 == player || match.player2 == player,
    );
  }

  private getMatchByID(id: string): Match | undefined {
    return this._matches.find((match) => match.id == id);
  }

  private getPlayerObjByID(id: string): Player | undefined {
    return this._players.find((player) => player.id == id);
  }

  private addPlayer(player: Player) {
    this._players.push(player);
  }

  private removePlayer(player: Player) {
    this._players.splice(this._players.indexOf(player), 1);
  }

  private addMatch(match: Match) {
    this._matches.push(match);
  }

  private removeMatch(match: Match) {
    this._matches.splice(this._matches.indexOf(match), 1);
  }

  private endMatch(match: Match): void {
    const player1 = match.player1;
    const player2 = match.player2;

    this.removeMatch(match);
    this._io.socketsLeave(match.id);
    player1.matched = false;
    player2.matched = false;

    console.log(
      'Match %s has ended. Active matches: %d',
      match.id,
      this._matches.length,
    );
  }

  /**
   * Tries to find a match between two players.
   * If one is found, it will automatically create the match.
   */
  private matchmaking() {
    // Players that want to find a match
    const candidates: Player[] = [];

    this._players.forEach((player) => {
      if (player.wantsMatch) {
        candidates.push(player);
      }
    });

    if (candidates.length < 2) {
      // Cannot match with less than two people matching
      return;
    }

    shuffle(candidates);

    const match = new Match(uuidv4(), candidates[0]!, candidates[1]!);
    this.addMatch(match);

    match.player1.wantsMatch = false;
    match.player1.matched = true;

    match.player2.wantsMatch = false;
    match.player2.matched = true;

    this._io.to(match.player1.id).emit('matched', match.id, 0);
    this._io.to(match.player2.id).emit('matched', match.id, 1);

    this._io.in([match.player1.id, match.player2.id]).socketsJoin(match.id);

    console.log(
      'Match %s has started. Active matches: %d',
      match.id,
      this._matches.length,
    );
  }

  private playerEnters(id: string): void {
    const player = new Player(id);

    this.addPlayer(player);

    console.log(
      'Player %s has entered. Total players: %d',
      id,
      this._players.length,
    );
  }

  private playerLeaves(id: string): void {
    const player = this.getPlayerObjByID(id);

    if (player == undefined) {
      console.error('Trying to have a nonexistant player leave. Id: %s', id);
      return;
    }

    // Check to see if the player is in a match
    const match = this.getMatchPlayerIsIn(player);

    if (match != undefined) {
      // TODO: Grace period for the client reconnecting and resuming the match
      // The match does exist, so we need to end it as an error
      this._io.to(match.id).emit('matchError');
      this.endMatch(match);
    }

    this.removePlayer(player);

    console.log(
      'Player %s has left. Total players: %d',
      id,
      this._players.length,
    );
  }

  private setupSocketEvents(socket: Socket): void {
    socket.once('disconnecting', () => this.playerLeaves(socket.id));

    socket.on('match', () => {
      const player = this.getPlayerObjByID(socket.id);
      if (player == undefined) {
        return;
      }

      player.wantsMatch = true;
      this.matchmaking();
    });

    socket.on('matchEnd', (matchId, victor) => {
      const match = this.getMatchByID(matchId);

      if (match == undefined) {
        return;
      }

      this.endMatch(match);
    });

    socket.on('move', (matchId, move) => {
      const match = this.getMatchByID(matchId);

      if (match == undefined) {
        return;
      }

      socket.to(match.id).emit('move', move);
    });

    socket.on('surrender', (matchId) => {
      const match = this.getMatchByID(matchId);

      if (match == undefined) {
        return;
      }

      socket.to(match.id).emit('surrender');
      this.endMatch(match);
    });

    socket.on('offerDraw', (matchId) => {
      const match = this.getMatchByID(matchId);

      if (match == undefined) {
        return;
      }

      socket.to(match.id).emit('offerDraw');
    });

    socket.on('drawAccepted', (matchId) => {
      const match = this.getMatchByID(matchId);

      if (match == undefined) {
        return;
      }

      socket.to(match.id).emit('drawAccepted');
      this.endMatch(match);
    });

    socket.on('drawRejected', (matchId) => {
      const match = this.getMatchByID(matchId);

      if (match == undefined) {
        return;
      }

      socket.to(match.id).emit('drawRejected');
    });
  }
}

function shuffle<Type>(array: Type[]): Type[] {
  let currentIndex = array.length;
  let randomIndex = currentIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    const temp = array[currentIndex]!;
    array[currentIndex] = array[randomIndex]!;
    array[randomIndex] = temp;
  }

  return array;
}

new ChessServer().startListening();
