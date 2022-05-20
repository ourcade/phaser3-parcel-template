import Phaser, { Textures } from "phaser"
import Attributes from "./Attributes"
import Skills from "./Skills"

export default class PlayerCharacter extends Phaser.GameObjects.Image{
    constructor(scene, x, y, texture, attribute, startingValues){
        super(scene, x, y, texture)

        this.setPosition(x, y)
        this.setScale(0.1)

        scene.add.existing(this)

        this.offsetPositionBar = {x: this.width * 0.05, y: this.height * 0.05}
        let ChangeMaxHealth = (value) => {
            this.hp.maxValue += value
            this.hp.draw()
            this.attributeWindow.ChangeHealth(null, this.hp.maxValue)
        }
        this.Attributes = new Attributes(null, {ChangeHealth: ChangeMaxHealth})
        this.hp = new HealthBar(scene, x - this.offsetPositionBar.x, y - this.offsetPositionBar.y,
            {
                maxHealth: this.Attributes.GetHealth()
            })

        //this.Attributes.SetHealth(0)
        // this.Skills = new Skills(startingValues.Skills)

        this.attributeWindow = new AttributeWindow(scene, attribute)
        this.attributeWindow.ChangeHealth(this.hp.currentValue, this.hp.maxValue)
    }

    ChangePosition(x, y){
        this.setPosition(x, y)
        this.hp.x = x - this.offsetPositionBar.x
        this.hp.y = y - this.offsetPositionBar.y
        this.hp.draw()
    }

    DecreaseHP(amount){
        this.hp.currentValue -= amount
        this.hp.draw()
        this.attributeWindow.ChangeHealth(this.hp.currentValue)
    }
    IncreaseHP(amount){
        this.hp.currentValue += amount
        this.hp.draw()
        this.attributeWindow.ChangeHealth(this.hp.currentValue)
    }
}

class HealthBar{
    constructor(scene, x, y, parameters){
        this.bar = new Phaser.GameObjects.Graphics(scene)

        this.x = x
        this.y = y
        this.maxValue = parameters.maxHealth
        this.currentValue = 50

        this.draw()

        scene.add.existing(this.bar)
    }

    draw(){
        if(this.currentValue < 0) this.currentValue = 0
        if(this.currentValue > this.maxValue) this.currentValue = this.maxValue

        this.bar.clear()

        this.bar.fillStyle(0x000000)
        this.bar.fillRect(this.x, this.y, 80, 16)

        this.bar.fillStyle(0xffffff)
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12)

        let newColorBar = (this.currentValue / this.maxValue) < 0.3 && 0xff0000 || (this.currentValue / this.maxValue) < 0.5 && 0xffff00 || 0x00ff00
        this.bar.fillStyle(newColorBar)
        let newWidth = Math.floor(this.currentValue / this.maxValue * 100)
        this.bar.fillRect(this.x + 2, this.y + 2, newWidth * 0.76, 12)
    }
}

class AttributeWindow extends Phaser.GameObjects.Sprite{
    constructor(scene, transferredValues){
        super(scene, transferredValues.x, transferredValues.y, transferredValues.texture)
        scene.add.existing(this)

        this.barHP = new Phaser.GameObjects.Graphics(scene)
        scene.add.existing(this.barHP)
        this.maxHP = 100; this.currentHP = 100
        this.xBar = 98; this.yBar = 30
        this.scene.add.text(15, 30, `Health`, {color: "#f0e6df"})
        this.textHP = this.scene.add.text(-1, 30, `${this.currentHP}/${this.maxHP}`, {color: "#f2bf9f"})

        this.barMP = new Phaser.GameObjects.Graphics(scene)
        scene.add.existing(this.barMP)
        this.maxMP = 100; this.currentMP = 100
        this.scene.add.text(15, 50, `Magicka`, {color: "#f0e6df"})
        this.textMP = this.scene.add.text(-1, 50, `${this.currentMP}/${this.maxMP}`, {color: "#f2bf9f"})

        this.barFP = new Phaser.GameObjects.Graphics(scene)
        scene.add.existing(this.barFP)
        this.maxFP = 100; this.currentFP = 100
        this.scene.add.text(15, 70, `Fatigue`, {color: "#f0e6df"})
        this.textFP = this.scene.add.text(-1, 70, `${this.currentFP}/${this.maxFP}`, {color: "#f2bf9f"})
    }

    ChangeHealth(current, max){
        this.maxHP = max || this.maxHP; this.currentHP = current.toString() || this.currentHP

        let newWidth = Math.floor(this.currentHP / this.maxHP * 100)
        this.RedrawBar(this.barHP, this.xBar, this.yBar, newWidth, 0xef0000)

        this.textHP.text = `${this.currentHP}/${this.maxHP}`
        this.textHP.setX(170 - this.textHP.width)
        // Dont hp
        this.RedrawBar(this.barMP, this.xBar, this.yBar + 20, 50, 0x0000bf)
        this.textMP.setX(170 - this.textMP.width)

        this.RedrawBar(this.barFP, this.xBar, this.yBar + 40, 50, 0x00af00)
        this.textFP.setX(170 - this.textFP.width)
    }

    RedrawBar(bar, posX, posY, newWidth, color){
        bar.clear()

        bar.fillStyle(0xf2bf9f)
        bar.fillRect(posX, posY, 77, 16)

        bar.fillStyle(0x000000)
        bar.fillRect(posX + 1, posY + 1, 75, 14)

        bar.fillGradientStyle(color, color, 0x000000, 0x000000)
        bar.fillRect(posX + 1, posY + 1, newWidth * 0.75, 14)
    }
}