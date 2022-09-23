import Phaser from "phaser";

const formatLevel = (level) => {
  return `Level: ${level}`;
  // return "Level : "+ Level;
};

export default class LevelLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, level, style) {
    super(scene, x, y, formatLevel(level), style);

    this.level = level;
  }

  setLevel(level) {
    this.level = level;
    this.updateLevelText();
  }

  add(points) {
    this.setLevel(this.level + points);
  }

  updateLevelText() {
    this.setText(formatLevel(this.level));
  }
}
