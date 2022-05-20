let startAttributesValue = {
    Agility: 10,
    Endurance: 10,
    Intelligence: 10,
    Luck: 10,
    Personality: 10,
    Speed: 10,
    Strength: 10,
    Willpower: 10,
    Encumbrance: 10,
    Fatigue: 10,
    Health: 150,
    Magicka: 50,
}

let attributeDescription = {
    Agility: "Affects the chance of dodging an enemy's attack, landing a hit with a weapon, and blocking if equipped with a shield. Also increases resistance to staggering, and contributes to movement speed, jumping, climbing steep slopes, sneaking, disarming traps and lockpicking. One of the four factors that determine total Fatigue.",
    Endurance: "A factor in determining one's maximum Health, and the increase in Health at level-up. It is also one of the four factors that determine total Fatigue, allowing one to perform strenuous activities such as fighting or running for longer periods of time.",
    Intelligence: "A factor in determining the amount of Magicka one has available. Fifteen percent of Intelligence also represents the amount of Magicka regained for hour of rest.",
    Luck: "Affects the chance of success when: casting a spell, crafting a potion, enchanting an item, lockpicking, negotiating a price with a merchant, repairing items, sneaking without being detected, evading an enemy's attack, blocking if equipped with a shield, and hitting a target with a weapon or spell. It is not a factor in the quality of random loot.",
    Personality: "Affects relations and interactions with the citizens of Morrowind. It is a factor in the manipulation of others via admiration, intimidation, or taunting. It contributes to disposition (how much one is liked by others), affecting their willingness to share information or offer services. It is also a factor in successfully negotiating prices with merchants.",
    Speed: "Affects the swiftness with which one moves while walking, running, swimming, and to a lesser degree, levitating. Also impacts the horizontal distance traveled when jumping.",
    Strength: "Affects the amount of damage inflicted upon others with both melee and ranged weapons. It is also a factor in one's initial Health, maximum Encumbrance, and maximum Fatigue.",
    Willpower: "A factor in determining the chance of success when casting spells from all schools of magic (including those that are not governed by this attribute). Willpower contributes to one's natural ability to resist magic, and is one of four components that determine maximum Fatigue.",
    Encumbrance: "Maximum Encumbrance is the amount of weight that one can carry and is calculated by multiplying Strength by five. As one becomes increasingly encumbered the ability to jump and movement speed both decrease, and one becomes fatigued at an increased rate.",
    Fatigue: "Fatigue is a measurement of one's ability to effectively engage in strenuous activities including (but not limited to) combat, running, and spellcasting. Maximum Fatigue is determined by summing Agility, Endurance, Strength, and Willpower.",
    Health: "Health is a measurement of life, or how much damage can be taken before death. Initial maximum Health is determined by summing Endurance and Strength then dividing by two. It is increased by ten percent of Endurance with every increase in character level.",
    Magicka: "Magicka is the measurement of the magical energy one has available to cast spells. Without modifying the base Magicka multiplier, one point of Intelligence corresponds to one point of Magicka.",
}

export default class Attributes{
    constructor(startingValues, wishes){
        this.valueAttributes = startingValues || startAttributesValue
        this.emitter = EventDispatcher.getInstance()
        this.emitter.on("ChangeHealth", wishes.ChangeHealth)
        this.OnChangeHealth = (value) => {this.emitter.emit("ChangeHealth", value)}
    }

    GetHealth(){
        return this.valueAttributes.Health
    }
    SetHealth(value){
        this.valueAttributes.Health += value
        this.OnChangeHealth(value)
    }
}

let instance = null
class EventDispatcher extends Phaser.Events.EventEmitter {
    constructor() {
        super()
    }

    static getInstance() {
        if (instance == null) instance = new EventDispatcher()
        return instance
    }
}