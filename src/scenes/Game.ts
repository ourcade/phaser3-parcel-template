import Phaser from 'phaser'
// import astromechdroid from "../../public/assets/astromechdroid.png"

export default class Game extends Phaser.Scene {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private player?: Phaser.GameObjects.Sprite
    private boxes: Phaser.GameObjects.Sprite[] = []

    constructor() {
        super('hello-world')
    }

    preload() {
        // this.load.spritesheet('r2', astromechdroid, {
        //     frameWidth: 26,
        //     startFrame: 0
        // })

        this.load.spritesheet('tiles', 'assets/sokoban_tilesheet.png', {
            frameWidth: 64,
            startFrame: 0
        })

        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create() {
        const level = [
            [99, 99, 99, 99, 99, 99, 99, 99, 99, 99],
            [99, 0, 0, 0, 0, 0, 0, 0, 0, 99],
            [99, 0, 0, 0, 0, 0, 0, 0, 0, 99],
            [99, 0, 0, 51, 8, 0, 52, 0, 0, 99],
            [99, 0, 0, 0, 0, 0, 0, 0, 0, 99],
            [99, 0, 0, 0, 0, 0, 0, 0, 0, 99],
            [99, 0, 0, 0, 0, 0, 0, 0, 0, 99],
            [99, 99, 99, 99, 99, 99, 99, 99, 99, 99]

        ]
        const map = this.make.tilemap({
            data: level,
            tileWidth: 64,
            tileHeight: 64
        })

        const tiles = map.addTilesetImage('tiles')
        const layer = map.createLayer(0, tiles, 0, 0)

        // this.player = this.add.sprite(400, 300, 'r2', 5).setScale(1.5)
        this.player = layer.createFromTiles(52, 0, { key: 'tiles', frame: 52 }).pop()
        this.player?.setOrigin(0)

        this.createPlayerAnims()

        this.boxes = layer.createFromTiles(8, 0, { key: 'tiles', frame: 8 }).map(box => box.setOrigin(0))
        // this.anims.create({
        //     key: 'idle-left',
        //     frames: [{ key: 'r2', frame: 4 }],
        // })

        // this.anims.create({
        //     key: 'idle-right',
        //     frames: [{ key: 'r2', frame: 8 }],
        // })

        // this.anims.create({
        //     key: 'idle-up',
        //     frames: [{ key: 'r2', frame: 0 }],
        // })

        // this.anims.create({
        //     key: 'idle-down',
        //     frames: [{ key: 'r2', frame: 12 }],
        // })

        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNames('r2', { start: 4, end: 7 }),
        //     frameRate: 5,
        //     repeat: -1
        // })

        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNames('r2', { start: 8, end: 11 }),
        //     frameRate: 5,
        //     repeat: -1
        // })
        // this.anims.create({
        //     key: 'up',
        //     frames: this.anims.generateFrameNames('r2', { start: 0, end: 3 }),
        //     frameRate: 5,
        //     repeat: -1
        // })
        // this.anims.create({
        //     key: 'down',
        //     frames: this.anims.generateFrameNames('r2', { start: 12, end: 15 }),
        //     frameRate: 5,
        //     repeat: -1
        // })
    }

    update() {
        if (!this.cursors || !this.player) {
            return
        }

        const justLeft = Phaser.Input.Keyboard.JustDown(this.cursors.left)
        const justRight = Phaser.Input.Keyboard.JustDown(this.cursors.right)
        const justUp = Phaser.Input.Keyboard.JustDown(this.cursors.up)
        const justDown = Phaser.Input.Keyboard.JustDown(this.cursors.down)

        if (justLeft) {
            const box = this.getBoxAt(this.player.x - 32, this.player.y)
            const baseTween = {
                x: '-=64',
                duration: 500,
            }
            this.tweenMove(box, baseTween, () => {
                this.player?.anims.play('left', true)
            })
        } else if (justRight) {
            const box = this.getBoxAt(this.player.x + 96, this.player.y)
            const baseTween = {
                x: '+=64',
                duration: 500,
            }
            this.tweenMove(box, baseTween, () => {
                this.player?.anims.play('right', true)
            })
        } else if (justUp) {
            const box = this.getBoxAt(this.player.x, this.player.y - 32)
            const baseTween = {
                y: '-=64',
                duration: 500,
            }
            this.tweenMove(box, baseTween, () => {
                this.player?.anims.play('up', true)
            })
        } else if (justDown) {
            const box = this.getBoxAt(this.player.x, this.player.y + 96)
            const baseTween = {
                y: '+=64',
                duration: 500,
            }
            this.tweenMove(box, baseTween, () => {
                this.player?.anims.play('down', true)
            })
        } else if (this.player?.anims.currentAnim) {
            const key = this.player?.anims.currentAnim?.key
            if (!key.startsWith('idle-')) {
                this.player.anims.play(`idle-${key}`, true)
            }
        }
    }

    private tweenMove(box: Phaser.GameObjects.Sprite | undefined, baseTween: any, onStart: () => void) {
        if (box) {
            this.tweens.add(Object.assign(baseTween, { targets: box }))
        }
        {
            this.tweens.add(Object.assign(
                baseTween,
                {
                    targets: this.player,
                    onComplete: this.stopPlayerAnimation,
                    onCompleteScope: this,
                    onStart
                })
            )
        }
    }

    private stopPlayerAnimation() {
        if (!this.player) {
            return
        }

        const key = this.player?.anims.currentAnim?.key
        if (!key.startsWith('idle-')) {
            this.player.anims.play(`idle-${key}`, true)
        }
    }

    private getBoxAt(x: number, y: number) {
        return this.boxes.find(box => {
            const rect = box.getBounds()
            return rect.contains(x, y)
        })
    }

    private createPlayerAnims() {
        this.anims.create({
            key: 'idle-left',
            frames: [{ key: 'tiles', frame: 81 }],
        })

        this.anims.create({
            key: 'idle-right',
            frames: [{ key: 'tiles', frame: 78 }],
        })

        this.anims.create({
            key: 'idle-up',
            frames: [{ key: 'tiles', frame: 55 }],
        })

        this.anims.create({
            key: 'idle-down',
            frames: [{ key: 'tiles', frame: 52 }],
        })

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNames('tiles', { start: 81, end: 83 }),
            frameRate: 5,
            repeat: -1
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNames('tiles', { start: 78, end: 80 }),
            frameRate: 5,
            repeat: -1
        })
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNames('tiles', { start: 55, end: 57 }),
            frameRate: 5,
            repeat: -1
        })
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNames('tiles', { start: 52, end: 54 }),
            frameRate: 5,
            repeat: -1
        })
    }
}
