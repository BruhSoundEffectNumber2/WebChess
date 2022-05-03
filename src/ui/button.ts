import { BaseAlign, Color, Font, FontUnit, Label, Rectangle, ScreenElement, TextAlign, vec, Vector } from "excalibur";

export class Button extends ScreenElement {
    public label: Label;

    // Hex colors
    public idleColor = "#303030";
    public hoverColor = "#404040";
    public clickedColor = "#202020";

    constructor(pos: Vector, size: Vector, label = "Button") {
        super({
            x: pos.x - size.x / 2,
            y: pos.y + size.y / 2,
            width: size.x,
            height: size.y
        });

        this.label = new Label({
            text: label,
            pos: vec(size.x / 2, size.y / 2),
            font: new Font({
                family: "arial",
                size: 18,
                unit: FontUnit.Px,
                color: Color.White,
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            })
        });

        this.addChild(this.label);
    }

    onInitialize() {
        this.graphics.add("idle", new Rectangle({
            width: this.width,
            height: this.height,
            color: Color.fromHex(this.idleColor)
        }));

        this.graphics.add("hover", new Rectangle({
            width: this.width,
            height: this.height,
            color: Color.fromHex(this.hoverColor)
        }));

        this.graphics.add("clicked", new Rectangle({
            width: this.width,
            height: this.height,
            color: Color.fromHex(this.clickedColor)
        }));

        this.graphics.show("idle");

        this.on("pointerdown", () => {
            this.graphics.show("clicked");
        });

        this.on("pointerup", () => {
            this.graphics.show("hover");
        });

        this.on("pointerenter", () => {
            this.graphics.show("hover");
        });

        this.on("pointerleave", () => {
            this.graphics.show("idle");
        });
    }
}