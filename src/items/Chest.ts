import Phaser from "phaser";
import { getGlobalState, setGlobalState } from "../utils/useGlobal";

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.play("chest-closed");
  }

  open() {
    if (this.anims.currentAnim.key !== "chest-closed") {
      console.log(getGlobalState().navigate);
      return 0;
    }

    this.play("chest-open");
    setGlobalState({
      navigate: "Chest Open!",
    });
    return Phaser.Math.Between(50, 200);
  }
}
