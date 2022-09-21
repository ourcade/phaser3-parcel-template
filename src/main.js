import Phaser from "phaser";

import GameScene from "./scenes/GameScene";
import PreloadScene from "./scenes/PreloadScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  audio: {
    disableWebAudio: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: [PreloadScene, GameScene],
};

export default new Phaser.Game(config);
