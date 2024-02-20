import { _decorator, Component, Node, Quat, sys, Vec3 } from "cc";
const { ccclass, property } = _decorator;
import io from "socket.io-client/dist/socket.io.js";
import { Socket } from "socket.io-client";
import { renderMultiplayer } from "./renderMultiplayer";

class Player {
  uuid: string;
  x: number = 0;
  y: number = 0;
  z: number = 0;
  rot: Quat;
  node: Node | null = null;
  isRendered: boolean = false;

  constructor(socketInfo: Socket | string) {
    if (typeof socketInfo == "string") {
      this.uuid = socketInfo;
    } else {
      this.uuid = socketInfo.id;
    }
    // this.uuid = socketInfo.id;
    // this.uuid = "ssss";
    this.isRendered = false;
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
  rot: Quat;
  uuid: string;
}

@ccclass("networkClient")
export class networkClient extends Component {
  private preLastPosition: UpdateData = {
    x: 0,
    y: 0,
    z: 0,
    rot: new Quat(),
    uuid: "0",
  };
  socket?: Socket = null;
  private players: Player[] = [];
  private renderMultiplayer1 = new renderMultiplayer();

  onLoad() {
    this.players = [];
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
      // console.log(this.players);
      const index = this.players.findIndex(
        (player) => player.uuid === info.uuid
      );
      // console.log(`index is ${index}`);
      if (index !== -1 && this.players[index]) {
        const bufInfo: UpdateData = {
          x: info.x,
          y: info.y,
          z: info.z,
          rot: new Quat(info.rot[0], info.rot[1], info.rot[2], info.rot[3]),
          uuid: this.socket.id,
        };
        this.players[index].x = info.x;
        this.players[index].y = info.y;
        this.players[index].z = info.z;
        this.players[index].rot = info.rot;

        // Player movement
        // console.log(this.players[index].node)
        if (this.players[index].node) {
          this.players[index].node.setWorldPosition(
            new Vec3(
              this.players[index].x,
              this.players[index].y,
              this.players[index].z
            )
          );
          this.players[index].node.rotate(this.players[index].rot);



          console.log(`===============`);
          console.log(this.players[index].node.getRotation())
          console.log(this.players[index].rot)
          console.log(bufInfo.rot)
          console.log(info.rot)
          console.log(`===============`);
        }




        // console.log(this.players[index]);
      }
    });

    this.socket.on("playerConnected", async (player) => {
      console.log(`Players connected`);
      // console.log(`sexualno ${player}`)
      if (!this.players.length) {
        for (let i = 0; i < player.length; i++) {
          const newPlayer = new Player(player[i].uuid);
          console.log(player[i].uuid);
          newPlayer.x = player[i].x;
          newPlayer.y = player[i].y;
          newPlayer.z = player[i].z;
          newPlayer.rot = new Quat(
            player[i].rot.x,
            player[i].rot.y,
            player[i].rot.z,
            player[i].rot.w
          );
          // console.log(`newPlayer ${newPlayer}`)
          this.players.push(newPlayer);
          console.log(newPlayer);
        }
      } else {
        for (let i = 0; i < player.length; i++) {
          const index = this.players.findIndex(
            (myPlayer) => myPlayer.uuid == player[i].uuid
          );
          if (index == -1) {
            const newPlayer = new Player(player[i].uuid);
            console.log(player[i].uuid);
            newPlayer.x = player[i].x;
            newPlayer.y = player[i].y;
            newPlayer.z = player[i].z;
            newPlayer.rot = new Quat(
              player[i].rot.x,
              player[i].rot.y,
              player[i].rot.z,
              player[i].rot.w
            );
            // console.log(`newPlayer ${newPlayer}`)
            this.players.push(newPlayer);
            console.log(newPlayer);
          }
        }
      }

      console.log(this.players);
      const index = this.players.findIndex(
        (myPlayer) => this.socket.id === myPlayer.uuid
      );

      this.players.splice(index, 1);
      await this.renderPlayers();
      // console.log(this.players);
    });

    this.socket.on("playerDisconnected", (player) => {
      const index = this.players.findIndex(
        (myPlayer) => player.uuid === myPlayer.uuid
      );
      this.renderMultiplayer1.destroyObject(this.players[index].node);
      this.players.splice(index, 1);
      // console.log(this.players)
    });
  }

  protected async update(dt: number) {
    const pahan = this.node.getParent();
    const positionPlayer = new Vec3();
    const rotationPlayer = new Quat();
    pahan.getWorldPosition(positionPlayer);
    pahan.getWorldRotation(rotationPlayer);
    // console.log(positionPlayer)
    const fUpdate: UpdateData = {
      x: positionPlayer.x,
      y: positionPlayer.y,
      z: positionPlayer.z,
      rot: rotationPlayer,
      uuid: this.socket.id,
    };
    if (
      fUpdate.x == this.preLastPosition.x &&
      fUpdate.y == this.preLastPosition.y &&
      fUpdate.z == this.preLastPosition.z
    ) {
    } else {
      this.socket.emit("updateData", fUpdate);
      this.preLastPosition.x = fUpdate.x;
      this.preLastPosition.y = fUpdate.y;
      this.preLastPosition.z = fUpdate.z;
    }
    // console.log(this.players);
  }

  protected async renderPlayers() {
    if (!this.players.length) return;
    for (let player of this.players) {
      if (player.node === null) {
        player.node = await this.renderMultiplayer1.createObject();
      }
    }
  }
}
