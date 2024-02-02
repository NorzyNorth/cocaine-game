import { _decorator, Component, Node, sys } from "cc";
const { ccclass, property } = _decorator;
import io from "socket.io-client/dist/socket.io.js";
import { Socket } from "socket.io-client";

@ccclass("networkClient")
export class networkClient extends Component {
  socket?: Socket = null;

  onLoad() {
    console.log("Loading io...");
    if (!sys.isNative) {
      this.socket = io("ws://localhost:3000");
      this.socket.on("connect", () => {
        console.log("connected to server");
      });

      this.socket.on("connect_error", (e) => {
        console.log(`Connection Error: ${e}`);
      });
    } else {
      console.log("Running in native context");
    }
  }
}
