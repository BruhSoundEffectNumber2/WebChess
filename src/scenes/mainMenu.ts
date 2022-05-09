import { Engine, Scene } from "excalibur";
import { UIManager } from "../ui/uiManager";

export class MainMenu extends Scene {
    onActivate() {
        const startButton = document.createElement("button");

        startButton.className = "button button-start";

        startButton.onclick = (e) => {
            e.preventDefault();
        };
    }
}