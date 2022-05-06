import { io, Socket } from "socket.io-client";
import { Move } from "./move";

export class Network {
    private socket: Socket;
    private connected = false;

    connect() {
        this.socket = io("https://WebChessServer.damonlewis.repl.co");

        this.socket.on("connect", () => {
            console.log("Connected to server.");
            this.connected = true;
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnected from server.");
            this.connected = false;
        });

        this.socket.on("move", (...args) => {
            this.receiveMove(args[0]);
        });
    }

    sendMove(move: Move) {
        if (!this.connected) {
            console.log("Trying to do move, but we are not connected.");
            console.log(move);
            return;
        }

        this.socket.emit("move", move);
    }

    receiveMove(move: Move) {
        console.log(move);
    }
}