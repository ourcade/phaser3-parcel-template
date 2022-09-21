import Phaser, { Game } from "phaser";
import ScoreLabel from "../ui/ScoreLabel";
import LevelLabel from "../ui/LevelLabel";

import BombSpawner from "./BombSpawner";

import Sky from "../../public/assets/sky.png";
import Ground from "../../public/assets/clif1.png";
import Star from "../../public/assets/apple.png";
import Bomb from "../../public/assets/bomb.png";
import Dude from "../../public/assets/dude.png";

//import Explosion from "../../public/assets/audio/hit1.ogg";
//const Explosion = new URL('../../public/assets/audio/hit1.ogg', import.meta.url);
const Explosion = require("url:../../public/assets/audio/hit1.ogg");
const Eat = require("url:../../public/assets/audio/eat.mp3");
const backgroundMusic = require("url:../../public/assets/audio/backgroundMusic.mp3");
const GameO = require("url:../../public/assets/audio/GameO.mp3");

const GROUND_KEY = "ground";
const DUDE_KEY = "dude";
const STAR_KEY = "star";
const BOMB_KEY = "bomb";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "game-scene" });

    this.gameOver = false;
  }

  preload() {
    this.load.image("sky", Sky);
    this.load.image(GROUND_KEY, Ground);
    this.load.image(STAR_KEY, Star);
    this.load.image(BOMB_KEY, Bomb);
    this.load.audio("explosion", Explosion);
    this.load.audio("eat", Eat);
    this.load.audio("bgMusic", backgroundMusic);
    this.load.audio("gameo", GameO);
    this.load.spritesheet(DUDE_KEY, Dude, { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    this.add.image(400, 300, "sky");
    // this.add.image(400, 300, "watermelon")
    const platforms = this.createPlatform();
    this.stars = this.createStars();
    this.player = this.createPlayer();
    this.physics.add.collider(this.player, platforms); // ground physics
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.physics.add.collider(this.stars, platforms); // stars collision

    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    this.gameOverArea = this.add.text(400, 300, "GAME OVER", {
      fontSize: "80px",
      fill: "#000",
    });
    this.gameOverArea.setOrigin(0.5);
    this.gameOverArea.visible = false;

    this.LevelLabel = this.createLevelLabel(320, 560, 1);

    this.explosion = this.sound.add("explosion");
    this.eat = this.sound.add("eat");
    this.bgMusic = this.sound.add("bgMusic");
    this.gameO = this.sound.add("gameo");

    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    this.bgMusic.play(musicConfig);

    this.gameRestart = this.add.text(400, 400, "Press to restart", {
      fontSize: "40px",
      fill: "#000",
    });
    this.gameRestart.setOrigin(0.5);
    this.gameRestart.visible = false;

    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombsGroup, platforms);

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      bombsGroup,
      this.hitBomb,
      null,
      this
    );
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.eat.play();
    this.scoreLabel.add(1);
    if (this.stars.countActive(true) === 0) {
      // if stars are set to 0, reshow them
      //  A new batch of stars to collect
      this.stars.children.iterate((c) => {
        const child = /** @type{Phaser.Physics.Arcade.Sprite} */ (c);
        child.enableBody(true, child.x, 0, true, true);
      });
      this.bombSpawner.spawn(player.x);
    }
    if (this.stars.countActive(true) === 12) {
      this.LevelLabel.add(1);
    }
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160); // player speed

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160); // player speed

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    if (this.gameOver) {
      return;
    }
  }
  hitBomb(player, bomb) {
    this.bgMusic.stop();
    this.explosion.play();
    this.physics.pause();
    this.gameO.play();
    player.setTint(0xff0000);

    player.anims.play("turn");

    this.gameOver = true;

    this.gameOverArea.visible = true;
    this.gameRestart.visible = true;
    this.input.on("pointerdown", () => this.scene.start("game-scene") );
    this.input.on("pointerdown", () => this.gameO.stop() );
  }
  createPlatform() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(200, 660, GROUND_KEY).setScale(0.5).refreshBody(); // bottom ground

    platforms.create(100, 420, GROUND_KEY).setScale(0.1).refreshBody(); // middle ground
    platforms.create(50, 200, GROUND_KEY).setScale(0.1).refreshBody(); // middle ground
    platforms.create(750, 220, GROUND_KEY).setScale(0.1).refreshBody(); // top ground
    platforms.create(450, 350, GROUND_KEY).setScale(0.1).refreshBody(); // center ground

    return platforms;
  }

  createPlayer() {
    const player = (this.player = this.physics.add.sprite(100, 450, DUDE_KEY));

    this.player.setBounce(0.2); // when the dude lands on the ground he bounces up
    this.player.setCollideWorldBounds(true); // don't get off of the window
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: DUDE_KEY, frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    return player;
  }
  createStars() {
    const stars = this.physics.add.group({
      key: [STAR_KEY],
      repeat: 11, // number of apples
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((c) => {
      const child = /** @type{Phaser.Physics.Arcade.Sprite} */ (c);
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    return stars;
  }
  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }
  createLevelLabel(x, y, level) {
    const style = { fontSize: "35px", fill: "#000" };
    const label = new LevelLabel(this, x, y, level, style);

    this.add.existing(label);

    return label;
  }
}
