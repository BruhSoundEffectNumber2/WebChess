import {createServer} from 'http';
import {Server, Socket} from 'socket.io';

class Player {
  constructor(public readonly id: string, public matched = false) {}
}

class Match {
  constructor(
    public readonly room: string,
    public readonly player1: Player,
    public readonly player2: Player,
  ) {}
}

class ChessServer {
  private _players: Player[];
  private _matches: Match[];

  private _httpServer;
  private _io;

  constructor() {
    this._players = [];
    this._matches = [];

    // Create a WebServer that will accept data from our DevServer or our Netlify apps
    this._httpServer = createServer();
    this._io = new Server(httpServer, {
      cors: {
        origin: ['http://localhost:8080', /(?:chess-on-web\.netlify\.app)/],
      },
    });

    this._io.once('connection', (socket) => {
      this.playerEnters(socket.id);
      this.setupSocketEvents(socket);
    });
  }

  private getMatchPlayerIsIn(player: Player): Match | undefined {
    return this._matches.find(
      (match) => match.player1 == player || match.player2 == player,
    );
  }

  private getPlayerObjByID(id: string): Player | undefined {
    return this._players.find((player) => player.id == id);
  }

  private endMatch(match: Match): void {/* */}

  private playerEnters(id: string): void {/* */}

  private playerLeaves(id: string): void {/* */}

  private setupSocketEvents(socket: Socket): void {
    socket.once('disconnecting', () => this.playerLeaves(socket.id));
  }
}

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:8080', /(?:chess-on-web\.netlify\.app)/],
  },
});

const matchingPlayers: string[] = [];
const activeMatches: string[] = [];

io.on('connection', (socket) => {
  console.log('A user connected. Active users: ' + io.engine.clientsCount);

  socket.once('disconnect', () => {
    console.log('A user disconnected. Active users: ' + io.engine.clientsCount);

    matchingPlayers.splice(matchingPlayers.indexOf(socket.id), 1);
  });

  socket.on('match', () => {
    matchingPlayers.push(socket.id);

    tryToMatchPlayers();
  });

  socket.on('matchEnd', () => {
    // End of match behavior, scoring, ranking, etc
  });

  socket.on('move', (match, move) => {
    socket.to(match).emit('move', move);
  });

  socket.on('surrender', (match) => {
    socket.to(match).emit('surrender');
  });

  socket.on('offerDraw', (match) => {
    socket.to(match).emit('offerDraw');
  });

  socket.on('drawAccepted', (match) => {
    socket.to(match).emit('drawAccepted');
  });

  socket.on('drawRejected', (match) => {
    socket.to(match).emit('drawRejected');
  });
});

function tryToMatchPlayers(): void {
  if (matchingPlayers.length < 2) {
    console.log(
      'Tried to match players, but there was nobody to match them with.',
    );
    return;
  }

  if (matchingPlayers.length == 2) {
    matchPlayers(matchingPlayers[0]!, matchingPlayers[1]!);
    return;
  }

  // TODO: Matchmaking from a large pool of players
}

function matchPlayers(player1: string, player2: string): void {
  console.log('Matching players ' + player1 + ' and ' + player2);

  // Remove players from matching list
  const player1Index = matchingPlayers.indexOf(player1);
  matchingPlayers.splice(player1Index, 1);

  const player2Index = matchingPlayers.indexOf(player2);
  matchingPlayers.splice(player2Index, 1);

  // Create a room for the players
  const match: string = io.engine.generateId();
  activeMatches.push(match);

  io.to(player1).emit('matched', match, 0);
  io.to(player2).emit('matched', match, 1);

  io.to(player1).socketsJoin(match);
  io.to(player2).socketsJoin(match);
}

io.listen(3000);
console.log('Listening');
