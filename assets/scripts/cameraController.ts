import {
  _decorator,
  Component,
  input as engineInput,
  Input as EngineInput,
  EventMouse,
  EventKeyboard,
  Vec3,
  Node,
} from "cc";
import { CameraInput, _ScrollDirectionType } from "./cameraInput";
import CustomRay from "./auxiliary/customRay";
import { GameInput } from "./gameInput";
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
  private _fpsCamera: Node;
  private _tpsCamera: Node;
  start() {
    this._fpsCamera = this.node.getChildByName("FPS Camera");
    this._tpsCamera = this.node.getChildByName("TPS Camera");
    this._cameraInput = new CameraInput();
    this.applyCameraInput();
    this.castCameraRay();
  }

  update(deltaTime: number) {
    this.switchView();
    // this.updateCameraRay();
    // this.checkCameraRayHit();
    // console.log(`node pos ${this._tpsCamera.getPosition()}`);
    // console.log();
    // this.updateCameraRay();
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
    this._cameraRay = new CustomRay(this._tpsCamera, new Vec3(), new Vec3());
  }

  private updateCameraRay() {
    const fromWorld = new Vec3();
    const toWorld = new Vec3();
    this._tpsCamera.getWorldPosition(fromWorld);
    const parentNode = this._tpsCamera.getParent();
    parentNode.getWorldPosition(toWorld);
    // console.log(parentNode);

    this._cameraRay.update(fromWorld, toWorld);
  }

  // private updateCameraRay() {
  //   this._cameraRay.o = new Vec3(
  //     this._tpsCamera.position.x,
  //     tthis._tpsCamera.position.y,
  //     this._tpsCamera.position.z
  //   );
  //   this._cameraRay.d = new Vec3(
  //     this._tpsCamera.position.x - this._tpsCamera.position.x,
  //     this._tpsCamera.position.y - this._tpsCamera.position.y,
  //     this._tpsCamera.position.z - this._tpsCamera.position.z
  //   );
  // }

  // private checkCameraRayHit() {
  //   if (PhysicsSystem.instance.raycastClosest(this._cameraRay)) {
  //     // console.log("hit");
  //   }
  // }

  private switchView() {
    if (!GameInput.getSwitchViewInput()) return;
    if (this._tpsCamera.active === true && this._fpsCamera.active === false) {
      this._tpsCamera.active = false;
      this._fpsCamera.active = true;
    } else if (this._tpsCamera.active === false && this._fpsCamera.active === true) {
      this._tpsCamera.active = true;
      this._fpsCamera.active = false;
    } else {
      this._tpsCamera.active = false;
      this._fpsCamera.active = true;
    }
  }

  private scrollCamera(event: EventMouse) {
    const scrollY = event.getScrollY();
    if (this._tpsCamera.active === true && this._fpsCamera.active === false){
      if (scrollY > 0) {
        if (this._tpsCamera.position.x < -2) {
          this._tpsCamera.position = new Vec3(
            this._tpsCamera.position.x + this._cameraScrollSensivity,
            this._tpsCamera.position.y,
            this._tpsCamera.position.z
          );
        } else if (this._tpsCamera.position.x > -2) {
          this._tpsCamera.active = false;
          this._fpsCamera.active = true;
        }
      } else if (scrollY < 0) {
        if (this._tpsCamera.position.x > -5) {
          this._tpsCamera.position = new Vec3(
            this._tpsCamera.position.x - this._cameraScrollSensivity,
            this._tpsCamera.position.y,
            this._tpsCamera.position.z
          );
        }
      }
    } else if (this._fpsCamera.active == true && this._tpsCamera.active === false){
      if (scrollY < 0) {
        this._tpsCamera.position = new Vec3(
          -2.1,
          this._tpsCamera.position.y,
          this._tpsCamera.position.z
        );
        this._fpsCamera.active = false;
        this._tpsCamera.active = true;
      }
    }
  }
}
