import { _decorator, Component, Node, sys, Vec3 } from "cc";
const { ccclass, property } = _decorator;
import io from "socket.io-client/dist/socket.io.js";
import { Socket } from "socket.io-client";
import { renderMultiplayer } from "./renderMultiplayer";
class Player {
  uuid: string;
  x: number = 0;
  y: number = 0;
  z: number = 0;

  rendered: boolean = false;

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
  uuid: string;
}

@ccclass("networkClient")
export class networkClient extends Component {
  private preLastPosition: UpdateData = {
    x: 0,
    y: 0,
    z: 0,
    uuid: "0",
  };
  socket?: Socket = null;
  private players: Player[] = [];
  onLoad() {
    console.log("Loading io...");
    if (!sys.isNative) {
      this.socket = io("ws://localhost:3000");
      this.socket.on("connect", () => {
        console.log("connected to server");
      });

      this.socket.on("connect_error", (e) => {
        // console.log(`Connection Error: ${e}`);
      });
    } else {
      console.log("Running in native context");
    }
    this.socket.on("playerUpdated", (info) => {
      const index = this.players.findIndex(
        (player) => player.uuid === info.uuid
      );
      if (index !== -1 && this.players[index]) {
        const bufInfo: UpdateData = {
          x: info.x,
          y: info.y,
          z: info.z,
          uuid: this.socket.id,
        };
        this.players[index].x = info.x;
        this.players[index].y = info.y;
        this.players[index].z = info.z;
        console.log(this.players[index]);
      }
    });
    this.socket.on("playerConnected", (player) => {
      this.players = [];
      this.players.push(...player);
      const index = this.players.findIndex(
        (myPlayer) => this.socket.id === myPlayer.uuid
      );
      this.players.splice(index, 1);
      console.log(this.players);
    });
    this.socket.on("playerDisconnected", (player) => {
      const index = this.players.findIndex(
        (myPlayer) => player.uuid === myPlayer.uuid
      );
      this.players.splice(index, 1);
      // console.log(this.players)
    });
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
      uuid: this.socket.id,
    };
    if (
      Math.floor(fUpdate.x) == Math.floor(this.preLastPosition.x) &&
      Math.floor(fUpdate.y) == Math.floor(this.preLastPosition.y) &&
      Math.floor(fUpdate.z) == Math.floor(this.preLastPosition.z)
    ) {
    } else {
      this.socket.emit("updateData", fUpdate);
      this.preLastPosition.x = fUpdate.x;
      this.preLastPosition.y = fUpdate.y;
      this.preLastPosition.z = fUpdate.z;
    }
    // console.log(this.players);

    this.renderPlayers();
  }

  protected renderPlayers() {
    if (!this.players.length) return;
    for (const player of this.players) {
      if (!player.rendered) {
        console.log("keke da meme");
        const renderMultiplayer1 = new renderMultiplayer();
        renderMultiplayer1.executeCode();
        player.rendered = true;
      }
    }
  }
}
