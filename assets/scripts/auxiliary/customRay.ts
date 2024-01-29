import {
  Color,
  GradientRange,
  Line,
  Vec3,
  geometry,
  PhysicsSystem,
} from "cc";

export default class CustomRay {
  from: Vec3;
  to: Vec3;
  display: Boolean = false;
  private ray = { geometry };
  private _line = new Line();
  private _ray: geometry.Ray;
  constructor(from: Vec3, to: Vec3) {
    this.from = from;
    this.to = to;
    this._ray = new geometry.Ray();
    geometry.Ray.fromPoints(this._ray,from,to)
  }
  isHit() {
    const buf = []
    if (PhysicsSystem.instance.raycast(this._ray)) {
      PhysicsSystem.instance.raycastResults.map(el => {
        el.distance < Vec3.distance(this.from,this.to) ? buf.push(el) : null
      })
    }
    return buf;
  }
  update(from: Vec3, to: Vec3) {
    geometry.Ray.fromPoints(this._ray,from,to)
    console.log(`Ray from ${this._ray.o} to ${this._ray.d}`)
  }

  diplay() {}
}
