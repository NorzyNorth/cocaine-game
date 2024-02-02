import { _decorator, Component, Node, sys, Vec3 } from "cc";
const { ccclass, property } = _decorator;
import io from "socket.io-client/dist/socket.io.js";
import { Socket } from "socket.io-client";

interface UpdateData {
  x: number;
  y: number;
  z: number;
}

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
  protected update(dt: number): void {
    const pahan = this.node.getParent();
    const positionPlayer = new Vec3();
    pahan.getWorldPosition(positionPlayer);
    console.log(positionPlayer)
    const fUpdate: UpdateData = {
      x: positionPlayer.x,
      y: positionPlayer.y,
      z: positionPlayer.z,
    };
    this.socket.emit("updateData", fUpdate);
    
  }
}
