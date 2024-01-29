import { _decorator, Component, Node, Vec3, Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LineDrawer')
export class LineDrawer extends Component {

    @property(Node)
    graphicsNode: Node | null = null; // Узел, содержащий компонент Graphics

    drawLine(startPos: Vec3, endPos: Vec3) {
        console.log(`Big Dildo`);
        if (this.graphicsNode) {
            const graphics = this.graphicsNode.getComponent(Graphics);
            console.log(`Big Dildo`);
            
            if (graphics) {
                console.log(`Big Dildo 2`);
                // graphics.clear();
                graphics.moveTo(startPos.x, startPos.y);
                graphics.lineTo(endPos.x, endPos.y);
                graphics.stroke();
            }
        }
    }
}
