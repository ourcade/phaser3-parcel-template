import Phaser from 'phaser'
import PlayerCharacter from './characters/PlayerCharacter'

import GameScene from './scenes/GameScene'

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth * 0.99,
	height: window.innerHeight * 0.98,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [GameScene]
}

export default new Phaser.Game(config)