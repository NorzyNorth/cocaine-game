import { Color, GradientRange, Line, Vec3, geometry } from "cc";

export default class CustomRay {
  rayLength: number;
  from: Vec3;
  to: Vec3;
  display: Boolean = false;
  private _line = new Line();
  private _ray: geometry.Ray;
  constructor(from: Vec3, to: Vec3, length: number) {
    this.rayLength = length;
    this.from = from;
    this.to = to;
    this._ray = new geometry.Ray(from.x, from.y, from.z, to.x, to.y, to.z);
  }
  isHit(): Boolean {
    return true;
  }
  update(from: Vec3, to: Vec3) {
    this._ray.o = from;
    this._ray.d = to;
    this.from = from;
    this.to = to;
  }

  diplay() {
    this._line.positions = [this.from, this.to];
    this._line.color = new GradientRange();
  }
}
