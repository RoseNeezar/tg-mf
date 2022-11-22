import Phaser from "phaser";
import { incfish, useBearStore } from "../utils/useBearStore";
import useGlobalstore from "../utils/useGlobal";

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
      console.log(useGlobalstore.getState().navigate);
      return 0;
    }

    this.play("chest-open");
    useGlobalstore.setState({
      navigate: "Chest Open!",
    });

    incfish(Math.floor(Math.random() * 3000));

    return Phaser.Math.Between(50, 200);
  }
}
