import { _decorator, Component, MeshCollider, MeshRenderer, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PhysicsFBX')
export class PhysicsFBX extends Component {
  start() {
    const res = this.node.getComponentsInChildren(MeshRenderer);

    for (let i = 0; i < res.length; i++) {
      const collider = res[i].addComponent(MeshCollider);
      collider.mesh = res[i].mesh;
    }
  }
}
