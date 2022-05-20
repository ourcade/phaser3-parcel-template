import Phaser, {Math} from "phaser"
import PlayerCharacter from '../characters/PlayerCharacter'

const KEYS = {
    DUDE: 'dude',
}

const MAPS = {
	SEYDA_NEEN: 'MW-map-Seyda_Neen',
	TEST_MAP: 'test-map',
}

const CHAR_SHEET = {
	ATTRIBUTES: "Attributes"
}

export default class GameScene extends Phaser.Scene{
    constructor(){
        super("game-scene")

		this.canMove = false
    }

    preload(){
		this.load.image(MAPS.SEYDA_NEEN, 'assets/maps/MW-map-Seyda_Neen.jpg')
		this.load.image(MAPS.TEST_MAP, 'assets/maps/test-map.jpg')

		this.load.image('testC', 'assets/characters/DnD-cleric.jpg')
		this.load.image(CHAR_SHEET.ATTRIBUTES, 'assets/character_sheet/Attributes.png')

		this.load.spritesheet(KEYS.DUDE,
			'assets/dude.png',
			{ frameWidth: 32, frameHeight: 48 }
		)
    }

    create(){
		this.add.image(800, 480, MAPS.TEST_MAP)

		let character = new PlayerCharacter(this, 800, 600, 'testC',
		 {x: 230, y: 240, texture: CHAR_SHEET.ATTRIBUTES})

		this.input.on('pointerdown', (pointer) => {
			if(Math.Difference(character.getCenter().x, pointer.x) < 30 &&
			 Math.Difference(character.getCenter().y, pointer.y) < 30){
				this.canMove = true
			}
		}, this)
		this.input.on('pointerup', () => {
			this.canMove = false
		}, this)
		this.input.on('pointermove', (pointer) => {
			if(this.canMove){
				character.ChangePosition(pointer.x, pointer.y)
			}
		}, this)

		this.input.keyboard.on('keydown-Z', (event) => {
			character.DecreaseHP(5)
		}, this)
		this.input.keyboard.on('keydown-X', (event) => {
			character.IncreaseHP(5)
		}, this)
    }
}