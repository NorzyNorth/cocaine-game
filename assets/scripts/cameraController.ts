import {
  _decorator,
  Component,
  Node,
  input as engineInput,
  Input as EngineInput,
  EventMouse,
  EventKeyboard,
  Vec3,
  geometry,
  PhysicsSystem,
} from "cc";
import { CameraInput, _ScrollDirectionType } from "./cameraInput";
import CustomRay from "./auxiliary/customRay";
const { ccclass, property } = _decorator;

export enum InputKeywordEventType {
  DOWN = "down",
  UP = "up",
}

export enum InputMouseEventType {
  SCROLL = "scroll",
}

@ccclass("cameraController")
export class cameraController extends Component {
  private _cameraInput: CameraInput;
  private _cameraScrollSensivity: number = 0.3;
  private _cameraRay: CustomRay;
  start() {
    this._cameraInput = new CameraInput();
    this.applyCameraInput();
    this.castCameraRay();
  }

  update(deltaTime: number) {
    // this.updateCameraRay();
    // this.checkCameraRayHit();
    // console.log(`node pos ${this.node.getPosition()}`);
    // console.log();
    this.updateCameraRay();
    // console.log(this._cameraRay.hasHit());
  }

  private applyCameraInput(): void {
    this.applyKeywordCameraInput();
    this.applyMouseCameraInput();
  }
  private applyKeywordCameraInput(): void {
    engineInput.on(EngineInput.EventType.KEY_DOWN, (event: EventKeyboard) =>
      this._cameraInput.getButton(event, InputKeywordEventType.DOWN)
    );
    engineInput.on(EngineInput.EventType.KEY_UP, (event: EventKeyboard) =>
      this._cameraInput.getButton(event, InputKeywordEventType.UP)
    );
  }

  private applyMouseCameraInput() {
    engineInput.on(EngineInput.EventType.MOUSE_WHEEL, (event: EventMouse) => {
      this.scrollCamera(event);
    });
  }

  private castCameraRay() {
    this._cameraRay = new CustomRay(this.node, new Vec3(), new Vec3());
  }

  private updateCameraRay() {
    const fromWorld = new Vec3();
    const toWorld = new Vec3();
    this.node.getWorldPosition(fromWorld);
    this.node.getParent().getWorldPosition(toWorld);
    this._cameraRay.update(fromWorld, toWorld);
  }

  // private updateCameraRay() {
  //   this._cameraRay.o = new Vec3(
  //     this.node.position.x,
  //     this.node.position.y,
  //     this.node.position.z
  //   );
  //   this._cameraRay.d = new Vec3(
  //     this.node.position.x - this.node.position.x,
  //     this.node.position.y - this.node.position.y,
  //     this.node.position.z - this.node.position.z
  //   );
  // }

  // private checkCameraRayHit() {
  //   if (PhysicsSystem.instance.raycastClosest(this._cameraRay)) {
  //     // console.log("hit");
  //   }
  // }

  scrollCamera(event: EventMouse) {
    const scrollY = event.getScrollY();
    if (scrollY > 0) {
      if (this.node.position.x < -2) {
        this.node.position = new Vec3(
          this.node.position.x + this._cameraScrollSensivity,
          this.node.position.y,
          this.node.position.z
        );
      }
    } else if (scrollY < 0) {
      if (this.node.position.x > -5) {
        this.node.position = new Vec3(
          this.node.position.x - this._cameraScrollSensivity,
          this.node.position.y,
          this.node.position.z
        );
      }
    }
  }
}
