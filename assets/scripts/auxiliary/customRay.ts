import {
  Color,
  GradientRange,
  Line,
  Vec3,
  geometry,
  PhysicsSystem,
  Node
} from "cc";
import { LineDrawer } from "./CustomRay/customRayHelper";
export default class CustomRay {
  from: Vec3;
  to: Vec3;
  display: Boolean = false;
  private ray = { geometry };
  private _line = new Line();
  private _ray: geometry.Ray;
  private _helper : LineDrawer
  node : Node
  constructor(node : Node ,from: Vec3, to: Vec3) {
    this.node = node
    this.from = from;
    this.to = to;
    this._ray = new geometry.Ray();
    geometry.Ray.fromPoints(this._ray,from,to)
  }
  hasHit() {
    const buf = []
    if (PhysicsSystem.instance.raycast(this._ray)) {
      PhysicsSystem.instance.raycastResults.map(el => {
        el.distance < Vec3.distance(this.from,this.to) ? buf.push(el) : null
      })
    }
    return buf;
  }
  update(from: Vec3, to: Vec3) {
    // console.log(to);
    
    geometry.Ray.fromPoints(this._ray,from,to)
    // console.log(`Ray from ${this._ray.o} to ${this._ray.d}`)
    // this.diplay()
  }

  diplay() {
    // console.log(`Big Dildo 1`);
    const lineDrawer = this.node.getComponent(LineDrawer);
    if (lineDrawer) {
        lineDrawer.drawLine(this.from, this.to);
    }
  }
}
