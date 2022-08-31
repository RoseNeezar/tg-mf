import Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";
import GameUI from "./scenes/GameUI";

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  banner: false,
  width: 400,
  height: 250,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [Preloader, Game, GameUI],
  scale: {
    zoom: 2,
  },
};

// const phaserGame = new Phaser.Game(config);

// export default phaserGameConfig;
