import {
  _decorator,
  Component,
  Node,
  input as engineInput,
  Input as EngineInput,
  EventMouse,
  EventKeyboard,
  Vec3,
} from "cc";
import { CameraInput, _ScrollDirectionType } from "./cameraInput";
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

  start() {
    this._cameraInput = new CameraInput();
    this.applyCameraInput();
  }

  update(deltaTime: number) {}

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

  scrollCamera(event: EventMouse) {
		const scrollY = event.getScrollY();
    if (scrollY > 0) {
			this.node.position = new Vec3(this.node.position.x + this._cameraScrollSensivity, this.node.position.y, this.node.position.z)
    } else if (scrollY < 0) {
      this.node.position = new Vec3(this.node.position.x - this._cameraScrollSensivity, this.node.position.y, this.node.position.z)
    }
  }
}
