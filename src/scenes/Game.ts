import Phaser from 'phaser'
import astromechdroid from "../../public/assets/astromechdroid.png"

export default class Game extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private player?: Phaser.GameObjects.Sprite

    constructor() {
        super('hello-world')
    }

    preload() {
        this.load.spritesheet('r2', astromechdroid, {
            frameWidth: 26,
            startFrame: 0
        })

        this.load.spritesheet('tiles', 'assets/sokoban_tilesheet.png', {
            frameWidth: 64,
            startFrame: 0
        })

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create() {
        const level = [
            [86, 86, 86, 86, 86, 86, 86, 86, 86, 86],
            [86, 0, 0, 0, 0, 0, 0, 0, 0, 86],
            [86, 0, 0, 0, 0, 0, 0, 0, 0, 86],
            [86, 0, 0, 51, 8, 0, 0, 0, 0, 86],
            [86, 0, 0, 0, 0, 0, 0, 0, 0, 86],
            [86, 0, 0, 0, 0, 0, 0, 0, 0, 86],
            [86, 0, 0, 0, 0, 0, 0, 0, 0, 86],
            [86, 86, 86, 86, 86, 86, 86, 86, 86, 86]

        ]
        const map = this.make.tilemap({
            data: level,
            tileWidth: 64,
            tileHeight: 64
        })

        const tiles = map.addTilesetImage('tiles')
        const layer = map.createStaticLayer(0, tiles, 0, 0)

        this.player = this.add.sprite(400, 300, 'r2', 5).setScale(1.5)

        this.anims.create({
            key: 'idle-left',
            frames: [{ key: 'r2', frame: 4 }],
        })

        this.anims.create({
            key: 'idle-right',
            frames: [{ key: 'r2', frame: 8 }],
        })

        this.anims.create({
            key: 'idle-up',
            frames: [{ key: 'r2', frame: 0 }],
        })

        this.anims.create({
            key: 'idle-left',
            frames: [{ key: 'r2', frame: 12 }],
        })

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNames('r2', { start: 4, end: 7 }),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNames('r2', { start: 8, end: 11 }),
            frameRate: 5,
            repeat: -1
        })
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNames('r2', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        })
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNames('r2', { start: 12, end: 15 }),
            frameRate: 5,
            repeat: -1
        })
    }

    update() {
        if (!this.cursors) {
            return
        }

        if (this.cursors.left?.isDown) {
            this.player?.anims.play('left', true)
        } else if (this.cursors.right?.isDown) {
            this.player?.anims.play('right', true)
        } else if (this.cursors.up?.isDown) {
            this.player?.anims.play('up', true)
        } else if (this.cursors.down?.isDown) {
            this.player?.anims.play('down', true)
        } else if (this.player?.anims.currentAnim) {
            const key = this.player?.anims.currentAnim?.key
            if (!key.startsWith('idle-')) {
                this.player.anims.play(`idle-${key}`, true)
            }
        }
    }
}
