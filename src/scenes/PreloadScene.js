import Phaser from 'phaser'
import Bg from "../../public/assets/background.jpg"

class PreloadScene extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'main-menu' })
	}

	

	preload()
    {
		this.load.image('background', Bg)
		// this.load.image('cursor-hand', 'assets/cursor_hand.png')
    }

    create()
    {
		this.add.image(400, 300, "background")
        this.input.on('pointerdown', () => this.scene.start('game-scene'))
        this.preText = this.add.text(400, 300, "Press anywhere to start the game", {fontSize: "40px", fill: "#000"});
        this.preText.setOrigin(0.5)
        //this.preText.visible = true
}

}

export default PreloadScene