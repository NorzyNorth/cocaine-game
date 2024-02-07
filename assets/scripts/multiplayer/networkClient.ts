import { _decorator, Component, Node, sys, Vec3 } from "cc";
const { ccclass, property } = _decorator;
import io from "socket.io-client/dist/socket.io.js";
import { Socket } from "socket.io-client";
class Player {
  uuid: string;
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(socketInfo: Socket) {
    this.uuid = socketInfo.id;
  }

  update(updateData: UpdateData) {
    this.x = updateData.x;
    this.y = updateData.y;
    this.z = updateData.z;
  }
}
interface UpdateData {
  x: number;
  y: number;
  z: number;
}

@ccclass("networkClient")
export class networkClient extends Component {
  private preLastPosition: UpdateData = {
    x: 0,
    y: 0,
    z: 0,
  };
  socket?: Socket = null;
  private players : Player[] = []
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
    this.socket.on("playerUpdated", (info : UpdateData) => {
      // console.log(info)
    })
    this.socket.on("playerConnected", (player) => {
      this.players = []
      this.players.push(...player)
      const index = this.players.findIndex((myPlayer) => this.socket.id === myPlayer.uuid);
      this.players.splice(index, 1);
      console.log(this.players)
    })
    this.socket.on("playerDisconnected", (player) => {
      const index = this.players.findIndex((myPlayer) => player.uuid === myPlayer.uuid);
      this.players.splice(index, 1);
      // console.log(this.players)
    })
  }
  protected update(dt: number): void {
    const pahan = this.node.getParent();
    const positionPlayer = new Vec3();
    pahan.getWorldPosition(positionPlayer);
    // console.log(positionPlayer)
    const fUpdate: UpdateData = {
      x: positionPlayer.x,
      y: positionPlayer.y,
      z: positionPlayer.z,
    };
    if (
      Math.floor(fUpdate.x) == Math.floor(this.preLastPosition.x) &&
      Math.floor(fUpdate.y) == Math.floor(this.preLastPosition.y) &&
      Math.floor(fUpdate.z) == Math.floor(this.preLastPosition.z)
    ) {
    } else {
      this.socket.emit("updateData", fUpdate);
      this.preLastPosition.x = fUpdate.x
      this.preLastPosition.y = fUpdate.y
      this.preLastPosition.z = fUpdate.z
    }
  }
}
