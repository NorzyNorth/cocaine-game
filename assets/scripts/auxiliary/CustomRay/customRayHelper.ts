import { _decorator, Component, Node, Graphics, Color, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DrawLineScript')
export class DrawLineScript extends Component {
    start() {

    }
    constructor() {
        super();
        
    }
    onLoad() {
        const lineNode = new Node("LineNode");
        this.node.addChild(lineNode);
        const graphics = lineNode.addComponent(Graphics);
        const startPoint = new Vec3(0, 0, 0);
        const endPoint = new Vec3(10, 10, 10);

        // Рисование линии
        graphics.lineWidth = 5;
        graphics.strokeColor = Color.GREEN;
        graphics.moveTo(startPoint.x, startPoint.y);
        graphics.lineTo(endPoint.x, endPoint.y);
        graphics.stroke();
    }
}
